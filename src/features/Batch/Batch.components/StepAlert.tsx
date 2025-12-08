// You can place these enums in a shared file if they are not already,
// for example, 'batch.types.ts' or similar.
// export enum EBatchStep { ... }
// export enum EStepStatus { ... }
// export enum EWorkflowStatus { ... }

import type { LucideProps } from 'lucide-react' // For icon type
// Reusable StepAlert component
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert' // Adjust path as needed

// Assuming these icons are available
import {
  Loader2 as AlertLoaderIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  FileCheckIcon, // Example for Confirmation
  SendIcon, // Example for Sending
  Settings2Icon, // Example for Preparation
  XCircleIcon,
  ZapIcon, // Example for FeeLoading
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EBatchStep, EStepStatus, EWorkflowStatus } from '../Batch.stores/store'

interface StepAlertProps {
  titleKey: string
  descriptionKey: string
  variant?: 'default' | 'destructive'
  icon?: React.ElementType<LucideProps>
  className?: string
  isLoading?: boolean // To show a spinning loader icon
  errorDetails?: {
    actualBalance?: number
    requiredFee?: number
    errorType?: string
  }
}

export function StepAlert({
  titleKey,
  descriptionKey,
  variant = 'default',
  icon: IconComponent,
  className,
  isLoading = false,
  errorDetails,
}: StepAlertProps) {
  const ActualIcon = isLoading ? AlertLoaderIcon : IconComponent
  const { t } = useTranslation()

  // Check if this is an insufficient fee error and we have details
  const isInsufficientFeeError = errorDetails?.actualBalance !== undefined
    && errorDetails?.requiredFee !== undefined
    && errorDetails?.errorType === 'InsufficientFeeError'

  // Use the appropriate translation key based on the step
  const insufficientFeeKey = descriptionKey.includes('feeTransactionPreparation')
    ? 'batch.steps.feeTransactionPreparation.error.insufficientFee.detailed'
    : 'batch.steps.feeTransactionPreparation.error.insufficientFee.detailed' // Can be reused for other steps

  const description = isInsufficientFeeError
    ? t(insufficientFeeKey, {
      actualBalance: errorDetails.actualBalance,
      requiredFee: errorDetails.requiredFee,
      missing: (errorDetails.requiredFee - errorDetails.actualBalance).toFixed(2),
    })
    : t(descriptionKey)

  return (
    <Alert variant={variant} className={className}>
      {ActualIcon && (
        <ActualIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      )}
      <AlertTitle>{t(titleKey)}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

// Helper to define alert properties
interface AlertContent {
  titleKey: string
  descriptionKey: string
  icon?: React.ElementType<LucideProps>
  variant?: 'default' | 'destructive'
  isLoading?: boolean
}

// Mapping step and status to alert content
// This provides default messages, which can be overridden by specific error messages from the store
export const stepAlertContentMap: Record<
  EBatchStep,
  Partial<Record<EStepStatus, AlertContent>>
> = {
  [EBatchStep.Initialization]: {
    [EStepStatus.Idle]: {
      titleKey: 'batch.steps.initialization.idle.title',
      descriptionKey: 'batch.steps.initialization.idle.description',
      icon: AlertLoaderIcon,
      isLoading: true,
    },
    [EStepStatus.Pending]: {
      titleKey: 'batch.steps.initialization.pending.title',
      descriptionKey: 'batch.steps.initialization.pending.description',
      icon: AlertLoaderIcon,
      isLoading: true,
    },
    [EStepStatus.Error]: {
      titleKey: 'batch.steps.initialization.error.title',
      descriptionKey: 'batch.steps.initialization.error.description',
      icon: XCircleIcon,
      variant: 'destructive',
    },
    [EStepStatus.Success]: {
      titleKey: 'batch.steps.initialization.success.title',
      descriptionKey: 'batch.steps.initialization.success.description',
      icon: CheckCircle2Icon,
    },
  },
  [EBatchStep.FeeLoading]: {
    [EStepStatus.Idle]: {
      titleKey: 'batch.steps.feeLoading.idle.title',
      descriptionKey: 'batch.steps.feeLoading.idle.description',
      icon: AlertLoaderIcon,
      isLoading: true,
    },
    [EStepStatus.Pending]: {
      titleKey: 'batch.steps.feeLoading.pending.title',
      descriptionKey: 'batch.steps.feeLoading.pending.description',
      icon: ZapIcon,
      isLoading: true,
    },
    [EStepStatus.Error]: {
      titleKey: 'batch.steps.feeLoading.error.title',
      descriptionKey: 'batch.steps.feeLoading.error.description',
      icon: XCircleIcon,
      variant: 'destructive',
    },
    [EStepStatus.Success]: {
      titleKey: 'batch.steps.feeLoading.success.title',
      descriptionKey: 'batch.steps.feeLoading.success.description',
      icon: CheckCircle2Icon,
    },
  },
  [EBatchStep.TransactionConfirmation]: {
    [EStepStatus.WaitingForUserInput]: {
      titleKey: 'batch.steps.transactionConfirmation.waitingForUserInput.title',
      descriptionKey: 'batch.steps.transactionConfirmation.waitingForUserInput.description',
      icon: FileCheckIcon,
    },
    [EStepStatus.Pending]: {
      titleKey: 'batch.steps.transactionConfirmation.pending.title',
      descriptionKey: 'batch.steps.transactionConfirmation.pending.description',
      icon: AlertLoaderIcon,
      isLoading: true,
    },
    [EStepStatus.Error]: {
      titleKey: 'batch.steps.transactionConfirmation.error.title',
      descriptionKey: 'batch.steps.transactionConfirmation.error.description',
      icon: XCircleIcon,
      variant: 'destructive',
    },
    [EStepStatus.Success]: {
      titleKey: 'batch.steps.transactionConfirmation.success.title',
      descriptionKey: 'batch.steps.transactionConfirmation.success.description',
      icon: CheckCircle2Icon,
    },
  },
  [EBatchStep.FeeTransactionPreparation]: {
    [EStepStatus.Idle]: {
      titleKey: 'batch.steps.feeTransactionPreparation.idle.title',
      descriptionKey: 'batch.steps.feeTransactionPreparation.idle.description',
      icon: Settings2Icon,
      isLoading: true,
    },
    [EStepStatus.Pending]: {
      titleKey: 'batch.steps.feeTransactionPreparation.pending.title',
      descriptionKey: 'batch.steps.feeTransactionPreparation.pending.description',
      icon: Settings2Icon,
      isLoading: true,
    },
    [EStepStatus.Error]: {
      titleKey: 'batch.steps.feeTransactionPreparation.error.title',
      descriptionKey: 'batch.steps.feeTransactionPreparation.error.description',
      icon: XCircleIcon,
      variant: 'destructive',
    },
    [EStepStatus.Success]: {
      titleKey: 'batch.steps.feeTransactionPreparation.success.title',
      descriptionKey: 'batch.steps.feeTransactionPreparation.success.description',
      icon: CheckCircle2Icon,
    },
  },
  [EBatchStep.TransactionPreparation]: {
    [EStepStatus.Idle]: {
      titleKey: 'batch.steps.transactionPreparation.idle.title',
      descriptionKey: 'batch.steps.transactionPreparation.idle.description',
      icon: Settings2Icon,
      isLoading: true,
    },
    [EStepStatus.Pending]: {
      titleKey: 'batch.steps.transactionPreparation.pending.title',
      descriptionKey: 'batch.steps.transactionPreparation.pending.description',
      icon: Settings2Icon,
      isLoading: true,
    },
    [EStepStatus.Error]: {
      titleKey: 'batch.steps.transactionPreparation.error.title',
      descriptionKey: 'batch.steps.transactionPreparation.error.description',
      icon: XCircleIcon,
      variant: 'destructive',
    },
    [EStepStatus.Success]: {
      titleKey: 'batch.steps.transactionPreparation.success.title',
      descriptionKey: 'batch.steps.transactionPreparation.success.description',
      icon: CheckCircle2Icon,
    },
  },
  [EBatchStep.TransactionSending]: {
    [EStepStatus.Idle]: {
      titleKey: 'batch.steps.transactionSending.idle.title',
      descriptionKey: 'batch.steps.transactionSending.idle.description',
      icon: SendIcon,
      isLoading: true,
    },
    [EStepStatus.Pending]: {
      titleKey: 'batch.steps.transactionSending.pending.title',
      descriptionKey: 'batch.steps.transactionSending.pending.description',
      icon: SendIcon,
      isLoading: true,
    },
    [EStepStatus.Error]: {
      titleKey: 'batch.steps.transactionSending.error.title',
      descriptionKey: 'batch.steps.transactionSending.error.description',
      icon: XCircleIcon,
      variant: 'destructive',
    },
    [EStepStatus.Success]: {
      titleKey: 'batch.steps.transactionSending.success.title',
      descriptionKey: 'batch.steps.transactionSending.success.description',
      icon: CheckCircle2Icon,
    },
  },
}

export const workflowAlertContentMap: Partial<Record<EWorkflowStatus, AlertContent>> = {
  [EWorkflowStatus.Succeeded]: {
    titleKey: 'batch.workflow.succeeded.title',
    descriptionKey: 'batch.workflow.succeeded.description',
    icon: CheckCircle2Icon,
  },
  [EWorkflowStatus.Failed]: {
    titleKey: 'batch.workflow.failed.title',
    descriptionKey: 'batch.workflow.failed.description',
    icon: XCircleIcon,
    variant: 'destructive',
  },
  [EWorkflowStatus.Aborted]: {
    titleKey: 'batch.workflow.cancelled.title',
    descriptionKey: 'batch.workflow.cancelled.description',
    icon: AlertTriangleIcon,
    variant: 'destructive',
  },
  [EWorkflowStatus.PartiallySucceeded]: {
    titleKey: 'batch.workflow.interrupted.title',
    descriptionKey: 'batch.workflow.interrupted.description',
    icon: AlertTriangleIcon,
  },
}
