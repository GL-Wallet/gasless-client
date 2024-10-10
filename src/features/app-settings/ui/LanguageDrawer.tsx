import { Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSettingsStore } from '@/entities/app-settings';
import { supportedLanguages } from '@/shared/constants/languages';
import { Button } from '@/shared/ui/button';
import {
	Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger
} from '@/shared/ui/drawer';
import { Separator } from '@/shared/ui/separator';

export const LanguageDrawer = () => {
  const [isOpened, setIsOpened] = useState(false);

  const updateSettings = useAppSettingsStore((store) => store.updateSettings);
  const { t, i18n } = useTranslation();

  const langCode = t('shared.lang.code') as keyof typeof supportedLanguages;
  const isLast = (index: number) => index === Object.values(supportedLanguages).length - 1;

  const handleChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    updateSettings({ language });

    setIsOpened(false);
  };

  return (
    <Drawer open={isOpened} onOpenChange={setIsOpened}>
      <DrawerTrigger asChild>
        <Button variant={'outline'} className="h-10">
          {supportedLanguages[langCode]}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-fit pb-10">
        <DrawerHeader>
          <DrawerTitle>{t('setting.language.title')}</DrawerTitle>
        </DrawerHeader>
        {Object.entries(supportedLanguages).map(([code, title], index) => (
          <div key={index}>
            <div
              className="flex items-center justify-between w-full px-6 py-5"
              onClick={() => handleChangeLanguage(code)}
            >
              <div className="flex items-center space-x-4">
                <span>{title}</span>
              </div>

              <div className="flex space-x-2">{langCode === code && <Check className="h-4 w-4" />}</div>
            </div>
            {!isLast(index) && <Separator />}
          </div>
        ))}
      </DrawerContent>
    </Drawer>
  );
};
