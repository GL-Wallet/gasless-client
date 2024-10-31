import {
	createContext, Dispatch, memo, PropsWithChildren, ReactNode, SetStateAction, useContext, useState
} from 'react';

import {
	AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
	AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '../alert-dialog';

type AlertState = {
  title: ReactNode;
  description: ReactNode;
};

type AlertActions = {
  handleCancel: () => void;
  handleContinue: () => void;
};

type AlertContext = {
  isOpen: boolean;
  state: AlertState;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setState: Dispatch<SetStateAction<AlertState>>;
  setActions: Dispatch<SetStateAction<Partial<AlertActions> | null>>;
};

const initialState: AlertState = { title: '', description: '' };

const AlertContext = createContext({} as AlertContext);

export const AlertProvider = memo(({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [state, setState] = useState<AlertState>(initialState);
  const [actions, setActions] = useState<Partial<AlertActions> | null>(null);

  const handleCancel = () => {
    actions?.handleCancel?.();
    setIsOpen(false);
  };

  const handleContinue = () => {
    actions?.handleContinue?.();
    setIsOpen(false);
  };

  return (
    <AlertContext.Provider value={{ isOpen, state, setActions, setIsOpen, setState }}>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-[90%] rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            <AlertDialogDescription>{state.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row items-center space-x-2">
            <AlertDialogCancel className="w-full mt-0" onClick={handleCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="w-full" onClick={handleContinue}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </AlertContext.Provider>
  );
});

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within a AlertProvider');
  }
  return context;
};
