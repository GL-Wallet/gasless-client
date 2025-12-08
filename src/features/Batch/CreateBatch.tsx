import type { BatchTypesDto } from '@/shared/api/batch'
import { getPrivateKey, useWallet } from '@/entities/wallet'
import { tronService } from '@/kernel/tron'
import { ROUTES } from '@/shared/constants/routes'
import ShinyButton from '@/shared/magicui/shiny-button'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { CircularProgress } from '@/shared/ui/progress'
import { AlertCircle, LucideLoader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'
import { BatchSummary } from './Batch.components/BatchSummary'
import { BatchTxList } from './Batch.components/BatchTxList'
import { StepAlert, stepAlertContentMap, workflowAlertContentMap } from './Batch.components/StepAlert'
import { EBatchStep, EStepStatus, EWorkflowStatus, useCreateBatchStore } from './Batch.stores/store'

interface BatchProps {
  id?: string | undefined
  txs?: BatchTypesDto.BatchTxDto[] | undefined
}

// Todo: sign trx fee tx

export function CreateBatch({ id, txs }: BatchProps) {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)

  const wallet = useWallet()
  const store = useCreateBatchStore()

  const {
    rawTransactions,
    workflowStatus,
    steps,
    currentProcessingStep,
    initializeBatch,
    userConfirmsTransactions,
    retryStep,
    abortBatch,
    totalEstimatedFee,
    lastError,
  } = store

  useEffect(() => {
    initializeBatch({
      batchIdToLoad: id,
      transactionsToProcess: txs,
    })
  }, [id, initializeBatch, txs])

  const cancel = async () => {
    abortBatch()

    await initializeBatch({
      batchIdToLoad: id,
      transactionsToProcess: txs,
    })
  }

  const balance = wallet.balances.USDT
  const totalAmount = rawTransactions.reduce((acc, tx) => acc + tx.amount, 0)
  const additionalFee = rawTransactions.length * 0.35
  const totalFee = totalEstimatedFee + additionalFee

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const privateKey = getPrivateKey()

      if (privateKey) {
        const balance = await tronService.fetchBalances(wallet.address, privateKey)

        if (balance.TRX < totalFee) {
          toast.error(t('batch.error.insufficientTRXBalance'))
        }
        else if (balance.USDT < totalAmount) {
          toast.error(t('batch.error.insufficientUSDTBalance'))
        }
        else {
          await userConfirmsTransactions()
        }
      }
      else {
        toast.error(t('batch.error.default'))
      }
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (currentProcessingStep) {
      console.warn(steps[currentProcessingStep])
    }

    if (lastError) {
      console.warn(lastError)
    }
  }, [currentProcessingStep, lastError, steps])

  return (
    <div className="flex-1 flex flex-col justify-between space-y-8">

      {/* Initialization - Idle */}
      {[
        currentProcessingStep === EBatchStep.Initialization,
        steps[EBatchStep.Initialization].status === EStepStatus.Idle,
      ].every(Boolean) && (
        <>
          <StepAlert {...stepAlertContentMap.Initialization.idle!} />
          <Loader />
        </>
      )}

      {/* Initialization - Pending */}
      {[
        currentProcessingStep === EBatchStep.Initialization,
        steps[EBatchStep.Initialization].status === EStepStatus.Pending,
      ].every(Boolean) && (
        <>
          <StepAlert {...stepAlertContentMap.Initialization.pending!} />
        </>
      )}

      {/* Initialization - Error */}
      {[
        currentProcessingStep === EBatchStep.Initialization,
        steps[EBatchStep.Initialization].status === EStepStatus.Error,
      ].every(Boolean) && (
        <>
          <StepAlert {...stepAlertContentMap.Initialization.error!} />
          <Button type="button" onClick={() => retryStep(EBatchStep.Initialization)}>
            {t('batch.button.retry')}
          </Button>
        </>
      )}

      {/* FeeLoading - Pending */}
      {[
        currentProcessingStep === EBatchStep.FeeLoading,
        steps[EBatchStep.FeeLoading].status === EStepStatus.Pending,
      ].every(Boolean) && (
        <>
          <StepAlert {...stepAlertContentMap.FeeLoading.pending!} />
        </>
      )}

      {/* FeeLoading - Error */}
      {[
        currentProcessingStep === EBatchStep.FeeLoading,
        steps[EBatchStep.FeeLoading].status === EStepStatus.Error,
      ].every(Boolean) && (
        <>
          <StepAlert {...stepAlertContentMap.FeeLoading.error!} />
          <Button type="button" onClick={() => retryStep(EBatchStep.FeeLoading)}>
            {t('batch.button.retry')}
          </Button>
        </>
      )}

      {/* TransactionConfirmation - WaitingForUserInput, Pending, Error */}
      {[
        currentProcessingStep === EBatchStep.TransactionConfirmation,
        [
          EStepStatus.WaitingForUserInput,
          EStepStatus.Pending,
          EStepStatus.Error,
        ].includes(steps[EBatchStep.TransactionConfirmation].status),
      ].every(Boolean) && (
        <>
          <div className="space-y-4">
            <BatchTxList data={rawTransactions as BatchTypesDto.BatchTxDto[]} withStatus={false} />

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm">{t('batch.fee.policy.title')}</AlertTitle>
              <AlertDescription className="text-xs">
                {t('batch.fee.policy.description')}
              </AlertDescription>
            </Alert>

            <BatchSummary
              balance={balance}
              totalAmount={totalAmount}
              estimatedFee={totalEstimatedFee}
              additionalFee={additionalFee}
              totalFee={totalFee}
            />

          </div>

          <ShinyButton
            text={t('batch.button.confirm')}
            onClick={handleSubmit}
            disabled={isLoading || currentProcessingStep !== EBatchStep.TransactionConfirmation}
            className="w-full"
          />
        </>
      )}

      {/* TransactionPreparation - Pending */}
      {[
        currentProcessingStep === EBatchStep.TransactionPreparation,
        steps[EBatchStep.TransactionPreparation].status === EStepStatus.Pending,
      ].every(Boolean) && (
        <>
          <StepAlert {...stepAlertContentMap.TransactionPreparation.pending!} />
          <CircleLoader progress={steps[EBatchStep.TransactionPreparation].progress} />
          <Button
            type="button"
            onClick={cancel}
            disabled={workflowStatus !== EWorkflowStatus.Running}
          >
            {t('batch.button.cancel')}
          </Button>

        </>
      )}

      {/* TransactionPreparation - Error */}
      {[
        currentProcessingStep === EBatchStep.TransactionPreparation,
        steps[EBatchStep.TransactionPreparation].status === EStepStatus.Error,
      ].every(Boolean) && (
        <>
          <StepAlert {...stepAlertContentMap.TransactionPreparation.error!} />
          <Button type="button" onClick={() => retryStep(EBatchStep.TransactionPreparation)}>
            {t('batch.button.retry')}
          </Button>
        </>
      )}

      {/* FeeTransactionPreparation - Pending */}
      {[
        currentProcessingStep === EBatchStep.FeeTransactionPreparation,
        steps[EBatchStep.FeeTransactionPreparation].status === EStepStatus.Pending,
      ].every(Boolean) && (
        <>
          <StepAlert {...stepAlertContentMap.FeeTransactionPreparation.pending!} />
        </>
      )}

      {/* FeeTransactionPreparation - Error */}
      {[
        currentProcessingStep === EBatchStep.FeeTransactionPreparation,
        steps[EBatchStep.FeeTransactionPreparation].status === EStepStatus.Error,
      ].every(Boolean) && (
        <>
          <StepAlert
            {...stepAlertContentMap.FeeTransactionPreparation.error!}
            errorDetails={extractErrorDetails(steps[EBatchStep.FeeTransactionPreparation].error)}
          />
          <Button type="button" onClick={() => retryStep(EBatchStep.FeeTransactionPreparation)}>
            {t('batch.button.retry')}
          </Button>
        </>
      )}

      {/* TransactionSending - Pending */}
      {[
        currentProcessingStep === EBatchStep.TransactionSending,
        steps[EBatchStep.TransactionSending].status === EStepStatus.Pending,
      ].every(Boolean) && (
        <>
          <StepAlert {...stepAlertContentMap.TransactionSending.pending!} />
        </>
      )}

      {/* TransactionSending - Error */}
      {[
        currentProcessingStep === EBatchStep.TransactionSending,
        steps[EBatchStep.TransactionSending].status === EStepStatus.Error,
      ].every(Boolean) && (
        <>
          <StepAlert
            {...stepAlertContentMap.TransactionSending.error!}
            errorDetails={extractErrorDetails(steps[EBatchStep.TransactionSending].error)}
          />
          <Button type="button" onClick={() => retryStep(EBatchStep.TransactionSending)}>
            {t('batch.button.retry')}
          </Button>
        </>
      )}

      {/* Workflow Status - Succeeded */}
      {[
        workflowStatus === EWorkflowStatus.Succeeded,
      ].every(Boolean) && (
        <>
          <StepAlert {...workflowAlertContentMap.succeeded!} />
          <Button type="button" onClick={() => navigate(ROUTES.BATCH, { replace: true })}>
            {t('batch.button.overview')}
          </Button>
        </>
      )}

    </div>
  )
}

export function Loader() {
  return (
    <div className="flex-1 flex justify-center items-center">
      <LucideLoader2 className="size-14 animate-spin" />
    </div>
  )
}

export function CircleLoader({ progress }: { progress: number }) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CircularProgress
        value={Math.round(progress)}
        size={120}
        strokeWidth={10}
        showLabel
        labelClassName="text-xl font-bold"
      />
    </div>
  )
}

/**
 * Extracts error details from API errors, specifically for InsufficientFeeError
 */
function extractErrorDetails(error: any): {
  actualBalance?: number
  requiredFee?: number
  errorType?: string
} | undefined {
  if (!error)
    return undefined

  // Check if error is an AxiosError with response data
  const errorData = error?.response?.data || error?.data || error
  const errorMessage = error?.message || errorData?.message || String(error || '')

  // Check if it's an InsufficientFeeError
  const isInsufficientFeeError = errorMessage.includes('InsufficientFeeError')
    || errorMessage.includes('balance is less than required fee')
    || errorMessage.includes('required fee minimum')
    || errorData?.name === 'InsufficientFeeError'
    || error?.name === 'InsufficientFeeError'

  if (isInsufficientFeeError) {
    // Try to extract from error data (backend may send structured error)
    let actualBalance = errorData?.actualBalance
    let requiredFee = errorData?.requiredFee || errorData?.expectedMinFee

    // If not in data, try to parse from message
    // Example: "User balance is less than required fee minimum (28)."
    if (actualBalance === undefined || requiredFee === undefined) {
      // Try to extract required fee from message (e.g., "minimum (28)")
      const feeMatch = errorMessage.match(/minimum\s*\((\d+(?:\.\d*)?)\)|required\D*(\d+\.?\d*)/i)
      if (feeMatch) {
        requiredFee = Number.parseFloat(feeMatch[1] || feeMatch[2])
      }

      // Try to extract actual balance from message or error data
      if (actualBalance === undefined) {
        // Check if there's a balance mentioned in the error
        const balanceMatch = errorMessage.match(/balance\D*(\d+\.?\d*)/i)
        if (balanceMatch) {
          actualBalance = Number.parseFloat(balanceMatch[1])
        }
        // Also check error data for actualBalance
        else if (errorData?.actualBalance !== undefined) {
          actualBalance = typeof errorData.actualBalance === 'number'
            ? errorData.actualBalance
            : Number.parseFloat(errorData.actualBalance)
        }
      }

      // If we still don't have requiredFee, try to get it from error data
      if (requiredFee === undefined && errorData?.expectedMinFee !== undefined) {
        requiredFee = typeof errorData.expectedMinFee === 'number'
          ? errorData.expectedMinFee
          : Number.parseFloat(errorData.expectedMinFee)
      }
    }
    else {
      // Convert to numbers if they're strings
      actualBalance = typeof actualBalance === 'number' ? actualBalance : Number.parseFloat(actualBalance)
      requiredFee = typeof requiredFee === 'number' ? requiredFee : Number.parseFloat(requiredFee)
    }

    // Only return if we have both values
    if (actualBalance !== undefined && !Number.isNaN(actualBalance)
      && requiredFee !== undefined && !Number.isNaN(requiredFee)) {
      return {
        actualBalance,
        requiredFee,
        errorType: 'InsufficientFeeError',
      }
    }
  }

  return undefined
}
