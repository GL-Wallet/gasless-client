export const SERVER_PORT = 8000

export const TRON_MAINNET_WEB3PROVIDER = 'https://api.trongrid.io'
export const TRON_TESTNET_WEB3PROVIDER = 'https://api.shasta.trongrid.io'

const isDev = import.meta.env.DEV

export const FULL_NODE: string = isDev ? TRON_TESTNET_WEB3PROVIDER : TRON_MAINNET_WEB3PROVIDER
export const SOLIDITY_NODE: string = isDev ? TRON_TESTNET_WEB3PROVIDER : TRON_MAINNET_WEB3PROVIDER
export const EVENT_SERVER: string = isDev ? TRON_TESTNET_WEB3PROVIDER : TRON_MAINNET_WEB3PROVIDER

export const USDT_CONTRACT_ADDRESS: string = isDev
  ? 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs'
  : 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
