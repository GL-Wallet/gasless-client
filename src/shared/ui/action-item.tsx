import { PropsWithClassname } from '../types/react';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export const ActionItem = ({ title, description, icon, onClick }: PropsWithClassname<Props>) => {
  return (
    <div onClick={onClick} className="flex items-center justify-between w-full pl-4 pr-2 py-4 border rounded-md">
      <div className="flex items-center space-x-4">
        {icon}
        <div className="flex flex-col">
          <span>{title}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
      </div>
    </div>
  );
};
