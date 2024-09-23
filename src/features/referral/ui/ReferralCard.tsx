import { CopyToClipboard } from '@/shared/ui/copy-to-clipboard';
import { useUtils } from '@telegram-apps/sdk-react';
import { Button } from '@/shared/ui/button';
import { ChevronRight } from 'lucide-react';

type Props = {
  userId: string | undefined;
};

export const ReferralCard = ({ userId }: Props) => {
  const utils = useUtils();

  const shareUrl = `${import.meta.env.VITE_APP_SHARE_LINK}?startapp=${userId}`;

  const handleShareInvite = () => {
    utils.shareURL(shareUrl, 'Hello everyone!');
  };

  return (
    <div
      className={
        'relative flex flex-col justify-between gap-4 bg-card/60 dark:bg-secondary/60 light-border p-4 h-fit w-full rounded-lg shadow-md'
      }
    >
      <div>
        <h4 className="text-lg font-bold primary-gradient">Invite a friend</h4>
        <p className="text-md primary-gradient">+10% friends savings for you</p>
      </div>

      <div className="flex items-center space-x-2">
        <Button onClick={handleShareInvite} className="w-full space-x-2 dark:border-neutral-700" variant={'outline'}>
          <span className="primary-gradient">Invite a friend</span>
          <ChevronRight className="size-4 dark:text-white" />
        </Button>
        <Button variant={'outline'} className="px-4">
          <CopyToClipboard value={shareUrl} size={5} />
        </Button>
      </div>
    </div>
  );
};
