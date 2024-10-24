import { ScanLine } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/shared/lib/utils';
import ShinyButton from '@/shared/magicui/shiny-button';
import { PropsWithClassname } from '@/shared/types/react';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Textarea } from '@/shared/ui/textarea';

import { useWalletImportForm } from '../model/useWalletImportForm';

const MemoizedFormMessage = React.memo(FormMessage);

export const WalletImportForm = (props: PropsWithClassname) => {
  const { isLoading, form, onSubmit, handleOpenQRScanner } = useWalletImportForm();

  const { t } = useTranslation();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={cn('grow flex flex-col justify-between space-y-6', props.className)}>
        <div className="space-y-6 overflow-y-auto">
          <FormField
            control={form.control}
            name="seedPhrase"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-bold primary-gradient">{t('wallet.setup.import.label')}</FormLabel>
                <FormControl>
                  <div className="relative h-fit">
                    <Textarea
                      rows={5}
                      {...field}
                      className="text-lg word-break pr-12 bg-transparent"
                      value={field.value || ''}
                    />

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
                <MemoizedFormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col space-y-5">
          <ShinyButton
            disabled={isLoading}
            type="submit"
            animate={false}
            text={t('wallet.setup.import.button.continue')}
            className="w-full"
          />
        </div>
      </form>
    </Form>
  );
};
