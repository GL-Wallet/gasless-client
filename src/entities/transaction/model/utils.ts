import { Transaction, TrxResponse, UsdtResponse } from './types';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import { TronWeb } from 'tronweb';
import { TRONSCAN_TRANSACTION_BASE_URL } from '../constants';

export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions, locales = 'uk-UA') => {
  const formatter = new Intl.DateTimeFormat(locales, options);
  return formatter.format(date);
};

export const isSentByWallet = (from: string, walletAddress: string): boolean => from === walletAddress;

export const extractTransactionData = (response: TrxResponse | UsdtResponse): Transaction | null => {
  if ('transaction_id' in response) {
    const { transaction_id, block_timestamp, from, to, value, token_info } = response as UsdtResponse;
    return {
      txid: transaction_id,
      token: AVAILABLE_TOKENS.USDT,
      amount: (Number(value) / Math.pow(10, token_info.decimals)).toFixed(2),
      from,
      to,
      timestamp: block_timestamp
    };
  } else if (response?.raw_data?.contract?.at(0)?.parameter?.value.amount) {
    const { txID, block_timestamp, raw_data } = response as TrxResponse;
    const contract = raw_data.contract[0];
    const value = contract.parameter.value.amount || 0;
    const from = TronWeb.address.fromHex(contract.parameter.value.owner_address);
    const to = TronWeb.address.fromHex(contract.parameter.value.to_address ?? '');

    return {
      txid: txID,
      token: AVAILABLE_TOKENS.TRX,
      amount: (value / Math.pow(10, 6)).toFixed(2),
      from,
      to,
      timestamp: block_timestamp
    };
  } else {
    return null;
  }
};

export const getTronscanLink = (txid: string) => {
  return [TRONSCAN_TRANSACTION_BASE_URL, txid].join('/');
};
