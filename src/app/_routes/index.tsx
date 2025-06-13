import { withWallet } from '@/entities/wallet'
import { withOnboarding } from '@/features/app-settings'

import { withAuth } from '@/kernel/auth'
import { OnboardingPage } from '@/pages/(app)/(onboarding)/OnboardingPage'
import { PasscodeRequestPage } from '@/pages/(app)/(passcode)/PasscodeRequestPage'
import { PasscodeSetupPage } from '@/pages/(app)/(passcode)/PasscodeSetupPage'
import { PasscodeStartupPage } from '@/pages/(app)/(passcode)/PasscodeStartupPage'
import { PasscodeUpdatePage } from '@/pages/(app)/(passcode)/PasscodeUpdatePage'
import { ReferralPage } from '@/pages/(app)/(referral)/ReferralPage'
import { AppSettingsPage } from '@/pages/(app)/(settings)/AppSettingsPage'
import { HomePage } from '@/pages/(app)/HomePage'
import { BackupMnemonic } from '@/pages/(wallet)/(backup)/BackupMnemonic'
import { BackupPrivateKey } from '@/pages/(wallet)/(backup)/BackupPrivateKey'
import { TransactionInProgress } from '@/pages/(wallet)/(transaction)/TransactionInProgress'
import { TransactionListPage } from '@/pages/(wallet)/(transaction)/TransactionListPage'
import { TransactionResultPage } from '@/pages/(wallet)/(transaction)/TransactionResultPage'
import { WalletExchangePage } from '@/pages/(wallet)/actions/WalletExchangePage'
import { WalletTransferPage } from '@/pages/(wallet)/actions/WalletTransferPage'
import {
  SeedPhraseConfirmationPage,
} from '@/pages/(wallet)/setup/(wallet-creation)/SeedPhraseConfirmationPage'
import { SeedPhrasePage } from '@/pages/(wallet)/setup/(wallet-creation)/SeedPhrasePage'
import {
  WalletCreationSuccessPage,
} from '@/pages/(wallet)/setup/(wallet-creation)/WalletCreationSuccessPage'
import {
  WalletCustomizationPage,
} from '@/pages/(wallet)/setup/(wallet-creation)/WalletCustomizationPage'
import { WalletImportPage } from '@/pages/(wallet)/setup/(wallet-import)/WalletImportPage'
import { WalletSetupPage } from '@/pages/(wallet)/setup/WalletSetupPage'
import { WalletUpdatePage } from '@/pages/(wallet)/update/WalletUpdatePage'
import { BatchBySlugPage } from '@/pages/Batch/BatchBySlugPage'
import { BatchPage } from '@/pages/Batch/BatchPage'
import { CreateBatchPage } from '@/pages/Batch/CreateBatchPage'
import { PrepareBatchPage } from '@/pages/Batch/PrepareBatchPage'
import { ROUTES } from '@/shared/constants/routes'
import { PageLoader } from '@/shared/ui/page-loader'
import { Suspense } from 'react'
import { Route, Switch } from 'wouter'

export function Routes() {
  return (
    <Switch>
      <Suspense fallback={<PageLoader />}>
        {/* Home page */}
        <Route
          path={ROUTES.HOME}
          component={withOnboarding(
            withWallet(withAuth(HomePage, { actionType: 'startup' }), ROUTES.WALLET_SETUP),
            <OnboardingPage />,
          )}
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
          component={({ params: { token } }) => <TransactionListPage token={token} />}
        />
        <Route path={ROUTES.TRANSACTION_IN_PROGRESS} component={TransactionInProgress} />

        {/* Referral */}
        <Route path={ROUTES.REFERRAL} component={ReferralPage} />

        {/* Backup */}
        <Route path={ROUTES.BACKUP_MNEMONIC} component={BackupMnemonic} />
        <Route path={ROUTES.BACKUP_PRIVATE_KEY} component={BackupPrivateKey} />

        <Route path={ROUTES.BATCH} component={BatchPage} />
        <Route path={ROUTES.BATCH_PARAMS} component={BatchBySlugPage} />
        <Route path={ROUTES.PREPARE_BATCH} component={PrepareBatchPage} />
        <Route path={ROUTES.CREATE_BATCH} component={CreateBatchPage} />
        <Route path={ROUTES.UPDATE_BATCH_PARAMS} component={CreateBatchPage} />
      </Suspense>
    </Switch>
  )
}
