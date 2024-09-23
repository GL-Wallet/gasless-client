import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import ShinyButton from '@/shared/magicui/shiny-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
  onSubmit(walletName: string): void;
  defaultValues?: z.infer<typeof formSchema>;
};

const formSchema = z.object({
  name: z.string().min(4, {
    message: 'Wallet name must be at least 4 characters.'
  })
});

export const WalletCustomizationForm = ({ onSubmit, defaultValues = { name: '' } }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values.name))}
        className="grow w-full flex flex-col justify-between space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className='flex flex-col items-start'>
              <FormLabel className='text-md font-bold primary-gradient'>Wallet Name</FormLabel>
              <FormControl>
                <Input placeholder="Wallet name" {...field} className="w-full h-13 text-lg bg-transparent " />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ShinyButton animate={false} text="Save" className="w-full" type="submit" />
      </form>
    </Form>
  );
};
