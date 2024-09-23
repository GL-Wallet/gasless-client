import { useSettingsItems } from '../model/useSettingsItems';
import { PropsWithClassname } from '@/shared/types/react';
import { SwitchItem } from '@/shared/ui/switch-item';
import { Fingerprint } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export const FinishSettingUp = ({ className }: PropsWithClassname) => {
  const { isBiometryEnabled, handleSwitchBiometry } = useSettingsItems();

  const isShowFinishSettingUp = !isBiometryEnabled;

  return (
    isShowFinishSettingUp && (
      <div className={cn('w-full space-y-3', className)}>
        <h3 className="primary-gradient text-md font-bold">Finish Setting Up</h3>
        <div className="space-y-4">
          {!isBiometryEnabled && (
            <SwitchItem
              title="Use biometrics"
              checked={isBiometryEnabled}
              onCheckedChange={handleSwitchBiometry}
              className="dark:bg-secondary/60"
              icon={<Fingerprint className="h-5 w-5" />}
            />
          )}
        </div>
      </div>
    )
  );
};
