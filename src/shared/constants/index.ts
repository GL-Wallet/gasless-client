export const TRONGRID_BASE_API_URL = import.meta.env.DEV
  ? 'https://api.shasta.trongrid.io/v1'
  : 'https://api.trongrid.io/v1'

// TronGrid answers keyless requests with 429, so every call must send the key.
export const TRONGRID_HEADERS = {
  'TRON-PRO-API-KEY': import.meta.env.VITE_TRONGRID_API_KEY,
}
