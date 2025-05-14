import type { UseFormReturn } from 'react-hook-form'
import type { BatchInputFormValues } from '../Batch.typings'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form'
import { Textarea } from '@/shared/ui/textarea'

interface BatchInputFormProps {
  form: UseFormReturn<BatchInputFormValues>
}

export function BatchInputForm({ form }: BatchInputFormProps) {
  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="text-xs bg-secondary/40"
                  rows={16}
                  placeholder="TV5R5JTud2iTkneKT8MFShxPGkRw5TaHit 100..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
