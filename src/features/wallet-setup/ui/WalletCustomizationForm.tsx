import ShinyButton from '@/shared/magicui/shiny-button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

interface Props {
  onSubmit: (walletName: string) => void
  isLoading?: boolean
  defaultValues?: z.infer<typeof formSchema>
}

const formSchema = z.object({
  name: z.string().min(4, {
    message: 'wallet.setup.customize.error.name',
  }),
})

export function WalletCustomizationForm({ isLoading, onSubmit, defaultValues = { name: '' } }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { t } = useTranslation()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(values => onSubmit(values.name))}
        className="flex-1 w-full flex flex-col justify-between space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-md font-bold primary-gradient">
                {t('wallet.setup.customize.walletName')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t('wallet.setup.customize.walletName')}
                  {...field}
                  className="w-full h-13 text-lg bg-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ShinyButton disabled={isLoading} animate={false} text={t('wallet.setup.customize.button')} className="w-full" type="submit" />
      </form>
    </Form>
  )
}
