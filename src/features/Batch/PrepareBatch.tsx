import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'
import ShinyButton from '@/shared/magicui/shiny-button'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { AlertCircle, BookOpen, Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'
import { BatchInputForm } from './Batch.components/Form'
import { MAX_BATCH_LENGTH, MIN_BATCH_LENGTH } from './Batch.constants'
import { usePrepareBatch } from './Batch.hooks/usePrepareBatch'

export function PrepareBatch() {
  const { t } = useTranslation()

  const { form: batchInputForm, submit, processBatchInput } = usePrepareBatch({
    onSubmit({ value }) {
      const { valid } = processBatchInput(value)

      navigate(ROUTES.CREATE_BATCH, {
        state: {
          txs: valid,
        },
      })
    },
  })

  const { valid, invalid } = processBatchInput(batchInputForm.watch('value'))

  return (
    <div className="h-full flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertTitle className="text-xs">{t('batch.alert.token.title')}</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            {t('batch.alert.token.description')}
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <BatchInputForm form={batchInputForm} />

          {invalid.length > 0 && (
            <div className="p-2 border border-dashed rounded-md">
              {invalid.map(({ address }, index) => (
                <div className="flex gap-2 items-center text-xs text-rose-400" key={index}>
                  <span>{address}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4">

            <div className="flex flex-col text-xs">
              <span className={cn({
                'text-rose-500': valid.length < MIN_BATCH_LENGTH,
                'text-green-500': valid.length >= MIN_BATCH_LENGTH,
              })}
              >
                {`${t('batch.alert.count.min.label')}: ${MIN_BATCH_LENGTH}`}
              </span>
              <span className={cn({
                'text-rose-500': valid.length > MAX_BATCH_LENGTH,
                'text-green-500': valid.length <= MAX_BATCH_LENGTH,
              })}
              >
                {`${t('batch.alert.count.max.label')}: ${MAX_BATCH_LENGTH}`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="flex items-center justify-center size-4 bg-green-400 rounded-full">
                    <Check className="size-3 text-white" />
                  </div>
                  <span>
                    {`${t('batch.alert.valid')}: ${valid.length}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex items-center justify-center size-4 bg-rose-500 rounded-full">
                    <X className="size-3 text-white" />
                  </div>
                  <span>
                    {`${t('batch.alert.invalid')}: ${invalid.length}`}
                  </span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs space-x-1">
                    <BookOpen className="size-4" />
                    <span>{t('batch.example.button')}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] rounded-md">
                  <DialogHeader>
                    <DialogTitle>{t('batch.example.title')}</DialogTitle>
                  </DialogHeader>
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>
                      {t('batch.example.paragraph.1.text')}
                      <br />
                      <code className="font-mono bg-muted px-1 py-0.5 rounded">{t('batch.example.paragraph.1.code')}</code>
                    </p>
                    <p>
                      {t('batch.example.paragraph.2.text')}
                    </p>
                    <div className="border bg-secondary/40 rounded-md p-2">
                      <div className="text-nowrap">TV5R5JTud2iTkneKT8MFShxPGkRw5TaHit 100</div>
                      <div className="text-nowrap">THQbYWkPDChusW8gNSmrsHeM3Nd8NgrawJ 50</div>
                      <div className="text-nowrap">TNCn58hYvZN1hMw5vurCz3LvV6oA2JvPQZ 5.5</div>
                      <div className="text-nowrap">TBQXxo7f5V8xDH2UAq1Liiso4M365K91nv 23.4</div>
                    </div>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>
                        {t('batch.example.rules.title')}
                        <code className="font-mono">T</code>
                      </li>
                      <li>{t('batch.example.rules.1')}</li>
                      <li>{t('batch.example.rules.2')}</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <ShinyButton
        text={t('batch.button.continue')}
        onClick={submit}
        disabled={valid.length < MIN_BATCH_LENGTH || valid.length > MAX_BATCH_LENGTH}
      />
    </div>
  )
}
