import { PasscodeUpdate, useAuth } from '@/kernel/auth';

export const PasscodeUpdatePage = () => {
  const { _passcodeHash, _onPasscodeSuccess } = useAuth();

  return (
    <div className="h-full flex justify-center items-center">
      <PasscodeUpdate passcodeHash={_passcodeHash} onPasscodeSuccess={_onPasscodeSuccess} />
    </div>
  );
};
