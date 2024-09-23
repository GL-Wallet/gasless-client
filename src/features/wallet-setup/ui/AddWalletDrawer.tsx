import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/shared/ui/drawer';
import ShinyButton from '@/shared/magicui/shiny-button';
import { ROUTES } from '@/shared/constants/routes';
import { Import, Plus, X } from 'lucide-react';
import { LinkItem } from '@/shared/ui/link-item';

const Actions = [
  {
    title: 'New Wallet',
    description: 'Create new wallet',
    icon: <Plus className="h-7 w-7" strokeWidth={4} />,
    href: ROUTES.WALLET_CUSTOMIZATION
  },
  {
    title: 'Existing Wallet',
    description: 'Import wallet with a 24 secret recovery words',
    icon: <Import className="h-7 w-7" />,
    href: ROUTES.WALLET_IMPORT
  }
];

export const AddWalletDrawer = () => {
  return (
    <Drawer>
      <div className="flex justify-center">
        <DrawerTrigger asChild>
          <ShinyButton text="Add Wallet" className="w-full" />
        </DrawerTrigger>
      </div>

      <DrawerContent className="px-4 h-1/2">
        <DrawerClose className="absolute top-4 right-4" asChild>
          <X className="text-muted-foreground" />
        </DrawerClose>

        <DrawerHeader>
          <DrawerTitle>Add Wallet</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-2">
          {Actions.map(({ title, description, icon, href }, idx) => (
            <LinkItem href={href} title={title} description={description} icon={icon} key={idx} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
