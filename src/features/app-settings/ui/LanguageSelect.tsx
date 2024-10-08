import { useTranslation } from 'react-i18next';

import { useAppSettingsStore } from '@/entities/app-settings';
import { supportedLanguages } from '@/shared/constants/languages';
import { cn } from '@/shared/lib/utils';
import { PropsWithClassname } from '@/shared/types/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

export const LanguageSelect = ({ className }: PropsWithClassname) => {
  const updateSettings = useAppSettingsStore((store) => store.updateSettings);
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    updateSettings({ language });
  };

  return (
    <Select onValueChange={handleChangeLanguage} value={t('shared.lang.code')}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent ref={(ref) => ref?.addEventListener('touchend', (e) => e.preventDefault())}>
        {Object.entries(supportedLanguages).map(([code, title]) => (
          <SelectItem value={code} key={code}>
            {title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
