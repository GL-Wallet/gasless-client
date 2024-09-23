export const TransactionListDateOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'Europe/Kiev',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
};

export const TransactionDateOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'Europe/Kiev',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
};

export const TRONSCAN_TRANSACTION_BASE_URL = 'https://tronscan.org/#/transaction';
