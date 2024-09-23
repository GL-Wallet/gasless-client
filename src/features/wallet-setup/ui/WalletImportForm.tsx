import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { PropsWithClassname } from '@/shared/types/react';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { ScanLine } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

import { useWalletImportForm } from '../model/useWalletImportForm';
import ShinyButton from '@/shared/magicui/shiny-button';

export const WalletImportForm = (props: PropsWithClassname) => {
  const { form, onSubmit, handleOpenQRScanner } = useWalletImportForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={cn('grow flex flex-col justify-between space-y-6', props.className)}>
        <div className="space-y-6 overflow-y-auto">
          <FormField
            control={form.control}
            name="seedPhrase"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-md font-bold primary-gradient'>Seed Phrase</FormLabel>
                <FormControl>
                  <div className="relative h-fit">
                    <Textarea rows={5} {...field} className="text-lg word-break pr-12 bg-transparent" value={field.value || ''} />

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenQRScanner();
                      }}
                      className="absolute top-1 right-1"
                      variant={'ghost'}
                      size={'icon'}
                    >
                      <ScanLine />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col space-y-5">
          <ShinyButton type="submit" animate={false} text="Continue" className="w-full" />
        </div>
      </form>
    </Form>
  );
};
