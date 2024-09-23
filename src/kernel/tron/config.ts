export const SERVER_PORT = 8000;

export const TRON_MAINNET_WEB3PROVIDER = 'https://api.trongrid.io';
export const TRON_TESTNET_WEB3PROVIDER = 'https://api.shasta.trongrid.io';

export const FULL_NODE: string = import.meta.env.DEV ? TRON_TESTNET_WEB3PROVIDER : TRON_MAINNET_WEB3PROVIDER;
export const SOLIDITY_NODE: string = import.meta.env.DEV ? TRON_TESTNET_WEB3PROVIDER : TRON_MAINNET_WEB3PROVIDER;
export const EVENT_SERVER: string = import.meta.env.DEV ? TRON_TESTNET_WEB3PROVIDER : TRON_MAINNET_WEB3PROVIDER;

export const USDT_CONTRACT_ADDRESS: string = import.meta.env.DEV
  ? 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs'
  : 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
