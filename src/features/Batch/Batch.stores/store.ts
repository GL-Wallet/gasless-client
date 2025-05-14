/* eslint-disable ts/ban-ts-comment */
/* eslint-disable ts/no-use-before-define */
/* eslint-disable style/max-statements-per-line */
import { getPrivateKey } from '@/entities/wallet' // Assuming this is a synchronous getter or handles its own async
import { tronService } from '@/kernel/tron' // Your Tron service
import { batch } from '@/shared/api/batch' // Your batch API service
import { fee } from '@/shared/api/fee'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { AskConfirmTx } from '../Batch.components/AskConfirmTx' // UI component for confirmation

// --- Enums and Types ---

export enum EBatchStep {
  Initialization = 'Initialization',
  FeeLoading = 'FeeLoading',
  TransactionConfirmation = 'TransactionConfirmation',
  TransactionPreparation = 'TransactionPreparation',
  FeeTransactionPreparation = 'FeeTransactionPreparation',
  TransactionSending = 'TransactionSending',
}

export enum EStepStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
  Skipped = 'skipped', // For steps that might not run
  WaitingForUserInput = 'waitingForUserInput', // For confirmation step
}

export enum EWorkflowStatus {
  Idle = 'idle',
  Running = 'running',
  RequiresConfirmation = 'requiresConfirmation',
  Succeeded = 'succeeded',
  PartiallySucceeded = 'partiallySucceeded', // Some non-critical steps failed
  Failed = 'failed',
  Aborted = 'aborted',
}

interface IBatchTxInput {
  id?: string
  address: string
  amount: number // Assuming this is in the smallest unit (e.g., SUN for TRX)
}

interface ISignedTxOutput {
  // Define structure based on what tronService.createAndSignTrc20Transaction returns
  // Example:
  raw_data_hex: string
  signature: string[]
  txID: string
  // ... other properties
}

interface ITransactionSendResult {
  txId: string // From ISignedTxOutput or API response
  sent: boolean
  error?: string
}

// Represents the state of a single step in the workflow
interface IStepState<TData = any, TError = any> {
  id: EBatchStep
  status: EStepStatus
  data?: TData
  error?: TError
  progress: number // Always 0-100
  attempts: number
  isCritical: boolean // Does failure of this step fail the entire workflow?
}

export interface IInitializeBatchPayload {
  batchIdToLoad?: string // To load an existing batch
  transactionsToProcess?: IBatchTxInput[] // To process a new list of transactions
}

// Represents the overall state of the batch creation workflow
interface IBatchWorkflowState {
  workflowStatus: EWorkflowStatus
  currentProcessingStep: EBatchStep | null // The step currently being executed or awaiting action
  steps: Record<EBatchStep, IStepState>
  stepOrder: EBatchStep[] // Defines the sequence of execution

  // Specific data related to the batch
  batchId: string | null // Can be assigned after creation or if loading existing
  rawTransactions: IBatchTxInput[]
  totalEstimatedFee: number // Store the calculated fee
  // Data from specific steps (could also live within stepState.data, but sometimes useful at top level)
  confirmedTransactions: IBatchTxInput[] // Txs user agreed to process
  preparedSignatures: Array<{ inputTx: IBatchTxInput, signedTx?: ISignedTxOutput, error?: string }>
  preparedFeeSignature: { inputTx: IBatchTxInput, signedTx?: ISignedTxOutput, error?: string } | null
  transactionSendResults: ITransactionSendResult[]

  abortController: AbortController | null
  lastError: string | null // Overall workflow error
}

interface IBatchWorkflowActions {
  initializeBatch: (payload: IInitializeBatchPayload) => Promise<void>
  userConfirmsTransactions: () => Promise<void> // Called after UI confirmation
  userRejectsTransactions: () => void
  retryStep: (stepId: EBatchStep) => Promise<void>
  retryWorkflow: () => Promise<void> // Retries from the first failed critical step or starts over
  abortBatch: () => void
  resetBatchWorkflow: () => void // Resets to initial state
}

const MAX_PROGRESS = 100

// --- Initial State Factory ---

function createInitialStepState(id: EBatchStep, isCritical = true): IStepState {
  return {
    id,
    status: EStepStatus.Idle,
    progress: 0,
    attempts: 0,
    isCritical,
  }
}

function makeInitialWorkflowState(): IBatchWorkflowState {
  const stepOrder: EBatchStep[] = [
    EBatchStep.Initialization,
    EBatchStep.FeeLoading,
    EBatchStep.TransactionConfirmation,
    EBatchStep.TransactionPreparation,
    EBatchStep.FeeTransactionPreparation,
    EBatchStep.TransactionSending,
  ]

  const steps = Object.fromEntries(
    stepOrder.map(stepId => [
      stepId,
      createInitialStepState(
        stepId,
        // Define which steps are critical
        ![EBatchStep.FeeLoading].includes(stepId), // Example: FeeLoading might not be critical if defaults can be used
      ),
    ]),
  ) as Record<EBatchStep, IStepState>

  // TransactionConfirmation is critical by default, but its failure mode is user rejection.
  steps[EBatchStep.TransactionConfirmation].isCritical = true

  return {
    workflowStatus: EWorkflowStatus.Idle,
    currentProcessingStep: null,
    steps,
    stepOrder,
    batchId: null,
    rawTransactions: [],
    totalEstimatedFee: 0,
    confirmedTransactions: [],
    preparedSignatures: [],
    preparedFeeSignature: null,
    transactionSendResults: [],
    abortController: null,
    lastError: null,
  }
}

// --- Zustand Store Definition ---

export const useCreateBatchStore = create<IBatchWorkflowState & IBatchWorkflowActions>()(
  devtools(
    immer((set, get) => {
      // --- Internal Helper Functions ---

      /**
       * Updates the state of a specific step.
       */
      const _updateStepState = (
        stepId: EBatchStep,
        newStatus: EStepStatus,
        payload?: { data?: any, error?: any, progress?: number },
      ) => {
        set((state) => {
          const step = state.steps[stepId]
          if (step) {
            step.status = newStatus
            if (payload?.data !== undefined)
              step.data = payload.data
            if (payload?.error !== undefined)
              step.error = payload.error
            if (payload?.progress !== undefined)
              step.progress = Math.min(MAX_PROGRESS, Math.max(0, payload.progress))
            if (newStatus === EStepStatus.Pending)
              step.attempts += 1
            if (newStatus === EStepStatus.Idle) { // Reset attempts and error if going back to idle for retry
              step.attempts = 0
              step.error = undefined
              step.progress = 0
            }
          }
        })
      }

      /**
       * Core workflow orchestrator. Determines and executes the next step.
       */
      const _proceedWorkflow = async (startingStepOverride?: EBatchStep): Promise<void> => {
        const state = get()
        if (state.workflowStatus === EWorkflowStatus.Aborted || state.abortController?.signal.aborted) {
          set((draft) => { draft.workflowStatus = EWorkflowStatus.Aborted })
          return
        }

        let currentStepIndex = -1
        if (startingStepOverride) {
          currentStepIndex = state.stepOrder.findIndex(id => id === startingStepOverride)
        }
        else {
          currentStepIndex = state.stepOrder.findIndex(id => id === state.currentProcessingStep)
          if (currentStepIndex === -1 || state.steps[state.currentProcessingStep!].status === EStepStatus.Success) {
            // Find next idle or waiting step if current is success or no current step
            currentStepIndex = state.stepOrder.findIndex(id =>
              state.steps[id].status === EStepStatus.Idle
              || state.steps[id].status === EStepStatus.WaitingForUserInput,
            )
          }
          else if (state.steps[state.currentProcessingStep!].status === EStepStatus.Error) {
            // If current step is in error, halt unless retried.
            set((draft) => {
              if (draft.steps[draft.currentProcessingStep!].isCritical) {
                draft.workflowStatus = EWorkflowStatus.Failed
                draft.lastError = `Critical step ${draft.currentProcessingStep} failed.`
              }
              else {
                // Non-critical error, may proceed or be partially completed
                // Check if any further steps can run
                const nextRunnableIndex = state.stepOrder.findIndex((id, index) =>
                  index > currentStepIndex && state.steps[id].status === EStepStatus.Idle,
                )
                if (nextRunnableIndex === -1) {
                  draft.workflowStatus = EWorkflowStatus.PartiallySucceeded
                }
                else {
                  // Potentially still running if other branches or non-dependent steps
                }
              }
            })
            return
          }
        }

        if (currentStepIndex === -1) {
          // All steps processed or no actionable step found
          const hasErrors = state.stepOrder.some(id => state.steps[id].status === EStepStatus.Error && state.steps[id].isCritical)
          const hasSomeErrors = state.stepOrder.some(id => state.steps[id].status === EStepStatus.Error)
          set((draft) => {
            draft.workflowStatus = hasErrors
              ? EWorkflowStatus.Failed
              : hasSomeErrors
                ? EWorkflowStatus.PartiallySucceeded
                : EWorkflowStatus.Succeeded
            draft.currentProcessingStep = null
          })
          return
        }

        const stepIdToExecute = state.stepOrder[currentStepIndex]
        set((draft) => {
          draft.currentProcessingStep = stepIdToExecute
          draft.workflowStatus = EWorkflowStatus.Running
        })

        // Execute the specific logic for the current step
        try {
          switch (stepIdToExecute) {
            case EBatchStep.Initialization:
              await _executeInitialization()
              break
            case EBatchStep.FeeLoading:
              await _executeFeeLoading()
              break
            case EBatchStep.TransactionConfirmation:
              // This step transitions to WaitingForUserInput, user action will resume.
              _updateStepState(stepIdToExecute, EStepStatus.WaitingForUserInput)
              set((draft) => { draft.workflowStatus = EWorkflowStatus.RequiresConfirmation })
              return // Halt orchestrator, wait for userConfirmsTransactions or userRejectsTransactions
            case EBatchStep.TransactionPreparation:
              await _executeTransactionPreparation()
              break
            case EBatchStep.FeeTransactionPreparation:
              await _executeFeeTransactionPreparation()
              break
            case EBatchStep.TransactionSending:
              await _executeTransactionSending()
              break
            default:
              throw new Error(`Unknown step: ${stepIdToExecute}`)
          }

          // If successful and not aborted, proceed to the next step
          if (get().steps[stepIdToExecute].status === EStepStatus.Success && !get().abortController?.signal.aborted) {
            _proceedWorkflow()
          }
          else if (get().abortController?.signal.aborted) {
            set((draft) => { draft.workflowStatus = EWorkflowStatus.Aborted })
          }
          // If error, _proceedWorkflow will be called by retryStep or will halt.
        }
        catch (error: any) {
          console.error(`Error during step ${stepIdToExecute}:`, error)
          _updateStepState(stepIdToExecute, EStepStatus.Error, { error })
          if (state.steps[stepIdToExecute].isCritical) {
            set((draft) => {
              draft.workflowStatus = EWorkflowStatus.Failed
              draft.lastError = `Critical step ${stepIdToExecute} failed: ${error?.message || error}`
            })
          }
          else {
            // Attempt to continue if non-critical error
            _proceedWorkflow()
          }
        }
      }

      // --- Step Execution Logic (Internal) ---

      const _executeInitialization = async () => {
        const stepId = EBatchStep.Initialization
        _updateStepState(stepId, EStepStatus.Pending)
        // @ts-expect-error
        const { batchIdToLoad, transactionsToProcess } = get()._tempInitPayload || {} // Assuming payload is temporarily stored

        if (!transactionsToProcess && batchIdToLoad) {
          try {
            const data = await batch.getRetryableBatch.fetcher({ batchId: batchIdToLoad })

            set((state) => {
              state.rawTransactions = data.txs
              state.batchId = batchIdToLoad // Persist loaded batchId
            })
            _updateStepState(stepId, EStepStatus.Success, { data: data.txs })
          }
          catch (error) {
            _updateStepState(stepId, EStepStatus.Error, { error })
            throw error // Propagate to orchestrator
          }
        }
        else if (transactionsToProcess) {
          set((state) => { state.rawTransactions = transactionsToProcess })
          _updateStepState(stepId, EStepStatus.Success, { data: transactionsToProcess })
        }
        else {
          const error = new Error('Invalid initialization: Provide batchIdToLoad or transactionsToProcess.')
          _updateStepState(stepId, EStepStatus.Error, { error })
          throw error
        }
      }

      const _executeFeeLoading = async () => {
        const stepId = EBatchStep.FeeLoading
        _updateStepState(stepId, EStepStatus.Pending, { progress: 0 })
        const transactions = get().rawTransactions
        if (!transactions.length) {
          _updateStepState(stepId, EStepStatus.Success, { data: 0, progress: MAX_PROGRESS }) // No fee for no txs
          return
        }

        try {
          let calculatedTotalFee = 0
          // Simulate fetching fee for each transaction or a batch fee
          // For demo, using a placeholder. Replace with actual tronService.estimateFee or similar.
          const { maxFee: feePerTx } = await fee.getFeesRange.fetcher({ network: 'TRON', asset: 'USDT' })
          for (let i = 0; i < transactions.length; i++) {
            if (get().abortController?.signal.aborted)
              throw new Error('Fee loading aborted')
            calculatedTotalFee += feePerTx // Replace with actual fee calculation
            _updateStepState(stepId, EStepStatus.Pending, { progress: ((i + 1) / transactions.length) * MAX_PROGRESS })
          }
          set((state) => { state.totalEstimatedFee = calculatedTotalFee })
          _updateStepState(stepId, EStepStatus.Success, { data: calculatedTotalFee, progress: MAX_PROGRESS })
        }
        catch (error) {
          _updateStepState(stepId, EStepStatus.Error, { error, progress: get().steps[stepId].progress })
          throw error
        }
      }

      const _executeTransactionPreparation = async () => {
        const stepId = EBatchStep.TransactionPreparation
        _updateStepState(stepId, EStepStatus.Pending, { progress: 0 })

        const privateKey = getPrivateKey() // Assuming this is available
        if (!privateKey) {
          const error = new Error('Private key not available for signing.')
          _updateStepState(stepId, EStepStatus.Error, { error })
          throw error
        }

        const transactionsToSign = get().confirmedTransactions
        const preparedSignatures: Array<{ inputTx: IBatchTxInput, signedTx?: ISignedTxOutput, error?: string }> = []
        let successfulSigns = 0

        if (!transactionsToSign.length) {
          _updateStepState(stepId, EStepStatus.Success, { data: [], progress: MAX_PROGRESS })
          return
        }

        const abortSignal = useCreateBatchStore.getState().abortController?.signal

        for (let i = 0; i < transactionsToSign.length; i++) {
          const tx = transactionsToSign[i]

          if (abortSignal?.aborted) {
            _updateStepState(stepId, EStepStatus.Idle, { progress: 0 })
            set((state) => { state.preparedSignatures = [] })

            return
          }

          try {
            const signedTx = await tronService
              .createAndSignTrc20Transaction(tx.address, tx.amount, privateKey, 6 * 60 * 60)

            preparedSignatures.push({ inputTx: tx, signedTx })
            successfulSigns++
          }
          catch (error: any) {
            preparedSignatures.push({ inputTx: tx, error: error.message || 'Signing failed' })
          }
          _updateStepState(stepId, EStepStatus.Pending, { progress: ((i + 1) / transactionsToSign.length) * MAX_PROGRESS })
        }
        set((state) => { state.preparedSignatures = preparedSignatures })

        if (successfulSigns === 0 && transactionsToSign.length > 0) {
          const error = new Error('All transactions failed to sign.')
          _updateStepState(stepId, EStepStatus.Error, { error, data: preparedSignatures, progress: MAX_PROGRESS })
          throw error
        }
        _updateStepState(stepId, EStepStatus.Success, { data: preparedSignatures, progress: MAX_PROGRESS })
      }

      const _executeFeeTransactionPreparation = async () => {
        const stepId = EBatchStep.FeeTransactionPreparation
        const totalFee = get().totalEstimatedFee

        let depositAddress: string | null = null

        if (!totalFee) {
          const error = new Error('Invalid fee.')
          _updateStepState(stepId, EStepStatus.Error, { error })
          throw error
        }

        _updateStepState(stepId, EStepStatus.Pending, { progress: 0 })

        const privateKey = getPrivateKey() // Assuming this is available
        if (!privateKey) {
          const error = new Error('Private key not available for signing.')
          _updateStepState(stepId, EStepStatus.Error, { error })
          throw error
        }

        try {
          const response = await fee.getFeesDepositAddress.fetcher({ network: 'TRON', asset: 'TRX' })
          depositAddress = response.address
        }
        catch {
          _updateStepState(stepId, EStepStatus.Error, { error: 'Error during loading deposit address.' })
        }

        if (!depositAddress) {
          const error = new Error('Deposit address not valid.')
          _updateStepState(stepId, EStepStatus.Error, { error })
          throw error
        }

        try {
          const signedTx = await tronService.createAndSignTrxTransaction(depositAddress, totalFee, privateKey)
          if (!signedTx)
            throw new Error('Fee transaction failed to sign.')

          _updateStepState(stepId, EStepStatus.Success, { data: signedTx, progress: MAX_PROGRESS })

          set((state) => {
            state.preparedFeeSignature = {
              inputTx: { address: depositAddress, amount: totalFee },
              signedTx,
            }
          })
        }
        catch (error) {
          _updateStepState(stepId, EStepStatus.Error, { error })
          throw error
        }
      }

      const _executeTransactionSending = async () => {
        const stepId = EBatchStep.TransactionSending
        _updateStepState(stepId, EStepStatus.Pending, { progress: 0 })

        const currentBatchId = get().batchId
        const signaturesToSend = get()
          .preparedSignatures
          .filter(p => p.signedTx)
          .map(p => ({ ...p.signedTx!, ...(p.inputTx.id && { id: p.inputTx.id }) }))

        const feeSignatureToSend = get().preparedFeeSignature

        if (!signaturesToSend.length) {
          if (get().preparedSignatures.length > 0) { // Had txs to sign, but all failed signing
            _updateStepState(stepId, EStepStatus.Skipped, { data: [], progress: MAX_PROGRESS })
            return
          }
          const error = new Error('No signed transactions to send.')
          _updateStepState(stepId, EStepStatus.Error, { error })
          throw error
        }

        if (!feeSignatureToSend?.signedTx) {
          const error = new Error('No signed fee transaction to send.')
          _updateStepState(stepId, EStepStatus.Error, { error })
          throw error
        }

        const abortSignal = useCreateBatchStore.getState().abortController?.signal

        try {
          let results: ITransactionSendResult[]
          if (currentBatchId) {
            // This assumes updateBatch can take an array of signed transactions.
            // Adjust if it's a different API structure.
            await batch.updateBatch.mutationFn({
              batchId: currentBatchId,
              feeTx: feeSignatureToSend.signedTx,
              txs: signaturesToSend,
              signal: abortSignal,
            })

            results = signaturesToSend.map(tx => ({ txId: tx.txID, sent: true })) // Simplified result
          }
          else {
            // This assumes createBatch returns a batchId and potentially results.
            await batch.createBatch.mutationFn({
              feeTx: feeSignatureToSend.signedTx,
              txs: signaturesToSend,
              signal: abortSignal,
            })

            results = signaturesToSend.map(tx => ({ txId: tx.txID, sent: true })) // Simplified result
          }
          set((state) => { state.transactionSendResults = results })
          _updateStepState(stepId, EStepStatus.Success, { data: results, progress: MAX_PROGRESS })
        }
        catch (error) {
          _updateStepState(stepId, EStepStatus.Error, { error, progress: MAX_PROGRESS }) // Progress max as attempt was made
          throw error
        }
      }

      // --- Public Actions ---
      return {
        ...makeInitialWorkflowState(), // Initialize with default structure

        // Temporary state to hold init payload before store is fully reset
        _tempInitPayload: null as IInitializeBatchPayload | null,

        initializeBatch: async (payload) => {
          set((state) => {
            // Full reset before initializing a new batch
            Object.assign(state, makeInitialWorkflowState())
            state.abortController = new AbortController() // New controller for this workflow
            state.workflowStatus = EWorkflowStatus.Running
            state.currentProcessingStep = EBatchStep.Initialization
            // @ts-expect-error
            state._tempInitPayload = payload // Store payload for _executeInitialization
          })
          await _proceedWorkflow(EBatchStep.Initialization)
        },

        userConfirmsTransactions: async () => {
          const stepId = EBatchStep.TransactionConfirmation
          const currentStepState = get().steps[stepId]

          if (currentStepState.status !== EStepStatus.WaitingForUserInput) {
            console.warn('Transaction confirmation not currently expected.')
            return
          }
          _updateStepState(stepId, EStepStatus.Pending) // Mark as pending while processing confirmation
          try {
            await AskConfirmTx.promise()() // Await the actual UI confirmation
            set((state) => { state.confirmedTransactions = [...state.rawTransactions] })
            _updateStepState(stepId, EStepStatus.Success, { data: get().rawTransactions })
            await _proceedWorkflow() // Continue to next step (TransactionPreparation)
          }
          catch { // User clicked "cancel" or modal closed
            console.warn('User rejected transaction confirmation.')
            _updateStepState(stepId, EStepStatus.WaitingForUserInput)
          }
        },

        userRejectsTransactions: () => {
          const stepId = EBatchStep.TransactionConfirmation
          _updateStepState(stepId, EStepStatus.Error, { error: new Error('User rejected confirmation') })
          set((state) => {
            state.workflowStatus = EWorkflowStatus.Failed
            state.lastError = 'User rejected transaction confirmation.'
            state.currentProcessingStep = null // Halt processing
          })
        },

        retryStep: async (stepIdToRetry: EBatchStep) => {
          const step = get().steps[stepIdToRetry]
          if (!step || step.status !== EStepStatus.Error) {
            console.warn(`Cannot retry step ${stepIdToRetry}: not in error state or does not exist.`)
            return
          }
          if (!step.isCritical && get().workflowStatus === EWorkflowStatus.PartiallySucceeded) {
            set((state) => { state.workflowStatus = EWorkflowStatus.Running })
          }
          else if (step.isCritical && get().workflowStatus === EWorkflowStatus.Failed) {
            set((state) => { state.workflowStatus = EWorkflowStatus.Running })
          }

          _updateStepState(stepIdToRetry, EStepStatus.Idle) // Reset status to allow re-execution
          // Reset subsequent steps as their input might change or they shouldn't have run.
          const stepIndex = get().stepOrder.indexOf(stepIdToRetry)
          get().stepOrder.slice(stepIndex + 1).forEach((id) => {
            _updateStepState(id, EStepStatus.Idle, { data: undefined, error: undefined, progress: 0 })
          })
          set((state) => {
            state.lastError = null // Clear previous overall error
            // Clear data that depends on steps after the retried one
            if (stepIdToRetry <= EBatchStep.TransactionConfirmation)
              state.confirmedTransactions = []
            if (stepIdToRetry <= EBatchStep.TransactionPreparation)
              state.preparedSignatures = []
            if (stepIdToRetry <= EBatchStep.FeeTransactionPreparation)
              state.preparedFeeSignature = null
            if (stepIdToRetry <= EBatchStep.TransactionSending)
              state.transactionSendResults = []
          })

          await _proceedWorkflow(stepIdToRetry)
        },

        retryWorkflow: async () => {
          const { workflowStatus, stepOrder, steps } = get()
          if (workflowStatus === EWorkflowStatus.Running) {
            console.warn('Workflow is already running.')
            return
          }

          let stepToStartFrom = stepOrder[0] // Default to start
          if (workflowStatus === EWorkflowStatus.Failed || workflowStatus === EWorkflowStatus.PartiallySucceeded) {
            const firstFailedCriticalStep = stepOrder.find(id => steps[id].status === EStepStatus.Error && steps[id].isCritical)
            if (firstFailedCriticalStep) {
              stepToStartFrom = firstFailedCriticalStep
            }
            else {
              // If no critical step failed, but workflow is "Failed" or "PartiallySucceeded",
              // it might be due to user rejection or all non-critical steps failing.
              // Restart from the first error or beginning.
              const firstErrorStep = stepOrder.find(id => steps[id].status === EStepStatus.Error)
              if (firstErrorStep)
                stepToStartFrom = firstErrorStep
            }
          }
          // Reset all steps from the determined starting point onwards
          const startIndex = stepOrder.indexOf(stepToStartFrom)
          stepOrder.slice(startIndex).forEach((id) => {
            // @ts-expect-error
            _updateStepState(id, EStepStatus.Idle, { data: undefined, error: undefined, progress: 0, attempts: 0 })
          })
          set((state) => {
            state.workflowStatus = EWorkflowStatus.Idle // Set to Idle before starting
            state.lastError = null
            // Clear relevant data based on where we restart
            if (startIndex <= state.stepOrder.indexOf(EBatchStep.TransactionConfirmation))
              state.confirmedTransactions = []
            if (startIndex <= state.stepOrder.indexOf(EBatchStep.TransactionPreparation))
              state.preparedSignatures = []
            if (startIndex <= state.stepOrder.indexOf(EBatchStep.FeeTransactionPreparation))
              state.preparedFeeSignature = null
            if (startIndex <= state.stepOrder.indexOf(EBatchStep.TransactionSending))
              state.transactionSendResults = []
          })

          // @ts-expect-error
          await get().initializeBatch(get()._tempInitPayload || {}) // Re-init or start directly
        },

        abortBatch: () => {
          get().abortController?.abort()

          set((state) => {
            state.workflowStatus = EWorkflowStatus.Aborted
            if (state.currentProcessingStep) {
              const currentStep = state.steps[state.currentProcessingStep]
              if (currentStep && currentStep.status === EStepStatus.Pending) {
                currentStep.status = EStepStatus.Idle // Or a specific "Aborted" status for the step
              }
            }

            state.lastError = 'Workflow aborted by user.'
          })
        },

        resetBatchWorkflow: () => {
          set((state) => {
            state.abortController?.abort() // Abort any ongoing operations
            Object.assign(state, makeInitialWorkflowState()) // Reset to the very initial state
            // @ts-expect-error
            state._tempInitPayload = null
          })
        },
      }
    }),
    { name: 'BatchWorkflowStore' },
  ),
)
