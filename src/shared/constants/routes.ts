export enum ROUTES {
  HOME = '/',
  APP_SETTINGS = '/app-settings',
  WALLET_SETUP = '/wallet-setup',
  WALLET_IMPORT = '/wallet-import',
  WALLET_UPDATE = '/wallet-update',
  WALLET_CUSTOMIZATION = '/wallet-customization',
  WALLET_CREATION_SUCCESS = '/wallet-creation-success',
  SEED_PHRASE = '/seed-phrase',
  SEED_PHRASE_CONFIRMATION = '/seed-phrase-confirmation',
  PASSCODE_STARTUP = '/passcode-startup',
  PASSCODE_REQUEST = '/passcode-request',
  PASSCODE_SETUP = '/passcode-setup',
  PASSCODE_UPDATE = '/passcode-update',
  WALLET_TRANSFER = '/wallet-transfer',
  WALLET_EXCHANGE = '/wallet-exchange',
  WALLET_TRANSFER_PARAMS = '/wallet-transfer/:token',

  TRANSACTION = '/transaction',
  TRANSACTION_PARAMS = '/transaction/:txid',
  TRANSACTIONS = '/transactions',
  TRANSACTIONS_PARAMS = '/transactions/:token',
  TRANSACTION_RESULT = '/transaction-result',
  TRANSACTION_RESULT_PARAMS = '/transaction-result/:txid',
  TRANSACTION_IN_PROGRESS = '/transaction-in-progress',

  REFERRAL = '/referral',

  BACKUP_MNEMONIC = '/backup-mnemonic',
  BACKUP_PRIVATE_KEY = '/backup-private-key'
}
