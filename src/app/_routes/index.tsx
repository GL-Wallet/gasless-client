import { SeedPhraseConfirmationPage } from '@/pages/(wallet)/setup/(wallet-creation)/SeedPhraseConfirmationPage';
import { WalletCreationSuccessPage } from '@/pages/(wallet)/setup/(wallet-creation)/WalletCreationSuccessPage';
import { WalletCustomizationPage } from '@/pages/(wallet)/setup/(wallet-creation)/WalletCustomizationPage';
import { TransactionResultPage } from '@/pages/(wallet)/(transaction)/TransactionResultPage';
import { TransactionInProgress } from '@/pages/(wallet)/(transaction)/TransactionInProgress';
import { WalletImportPage } from '@/pages/(wallet)/setup/(wallet-import)/WalletImportPage';
import { SeedPhrasePage } from '@/pages/(wallet)/setup/(wallet-creation)/SeedPhrasePage';
import { PasscodeStartupPage } from '@/pages/(app)/(passcode)/PasscodeStartupPage';
import { PasscodeRequestPage } from '@/pages/(app)/(passcode)/PasscodeRequestPage';
import { TransactionsPage } from '@/pages/(wallet)/(transaction)/TransactionsPage';
import { PasscodeUpdatePage } from '@/pages/(app)/(passcode)/PasscodeUpdatePage';
import { TransactionPage } from '@/pages/(wallet)/(transaction)/TransactionPage';
import { WalletExchangePage } from '@/pages/(wallet)/actions/WalletExchangePage';
import { PasscodeSetupPage } from '@/pages/(app)/(passcode)/PasscodeSetupPage';
import { WalletTransferPage } from '@/pages/(wallet)/actions/WalletTransferPage';
import { WalletUpdatePage } from '@/pages/(wallet)/update/WalletUpdatePage';
import { AppSettingsPage } from '@/pages/(app)/(settings)/AppSettingsPage';
import { WalletSetupPage } from '@/pages/(wallet)/setup/WalletSetupPage';
import { PageLoader } from '@/shared/ui/page-loader';
import { ROUTES } from '@/shared/constants/routes';
import { HomePage } from '@/pages/(app)/HomePage';
import { withWallet } from '@/entities/wallet';
import { withAuth } from '@/kernel/auth';
import { Route, Switch } from 'wouter';
import { Suspense } from 'react';
import { ReferralPage } from '@/pages/(app)/(referral)/ReferralPage';

export const Routes = () => {
  return (
    <Switch>
      <Suspense fallback={<PageLoader />}>
        {/* Home page */}
        <Route
          path={ROUTES.HOME}
          component={withWallet(withAuth(HomePage, { actionType: 'startup' }), ROUTES.WALLET_SETUP)}
        />

        {/* App settings */}
        <Route path={ROUTES.APP_SETTINGS} component={withWallet(AppSettingsPage, ROUTES.WALLET_SETUP)} />

        {/* Wallet setup flow routes */}
        <Route path={ROUTES.WALLET_SETUP} component={WalletSetupPage} />
        <Route path={ROUTES.WALLET_IMPORT} component={WalletImportPage} />
        <Route path={ROUTES.WALLET_CUSTOMIZATION} component={WalletCustomizationPage} />
        <Route path={ROUTES.WALLET_CREATION_SUCCESS} component={WalletCreationSuccessPage} />

        {/* Wallet update flow routes */}
        <Route path={ROUTES.WALLET_UPDATE} component={WalletUpdatePage} />

        {/* Seed phrase management routes */}
        <Route path={ROUTES.SEED_PHRASE} component={SeedPhrasePage} />
        <Route path={ROUTES.SEED_PHRASE_CONFIRMATION} component={SeedPhraseConfirmationPage} />

        {/* Seed phrase management routes */}
        <Route path={ROUTES.PASSCODE_STARTUP} component={PasscodeStartupPage} />
        <Route path={ROUTES.PASSCODE_REQUEST} component={PasscodeRequestPage} />
        <Route path={ROUTES.PASSCODE_SETUP} component={PasscodeSetupPage} />
        <Route path={ROUTES.PASSCODE_UPDATE} component={PasscodeUpdatePage} />

        {/* Token actions flow */}
        <Route path={ROUTES.WALLET_TRANSFER} component={() => <WalletTransferPage />} />
        <Route
          path={ROUTES.WALLET_TRANSFER_PARAMS}
          component={({ params: { token } }) => <WalletTransferPage token={token} />}
        />
        <Route path={ROUTES.WALLET_EXCHANGE} component={WalletExchangePage} />

        {/* Transactions */}
        <Route
          path={ROUTES.TRANSACTION_RESULT_PARAMS}
          component={({ params: { txid } }) => <TransactionResultPage txid={txid} />}
        />
        <Route
          path={ROUTES.TRANSACTIONS_PARAMS}
          component={({ params: { token } }) => <TransactionsPage token={token} />}
        />
        <Route path={ROUTES.TRANSACTION_PARAMS} component={({ params: { txid } }) => <TransactionPage txid={txid} />} />
        <Route path={ROUTES.TRANSACTION_IN_PROGRESS} component={TransactionInProgress} />

        {/* Referral */}
        <Route path={ROUTES.REFERRAL} component={ReferralPage} />
      </Suspense>
    </Switch>
  );
};
