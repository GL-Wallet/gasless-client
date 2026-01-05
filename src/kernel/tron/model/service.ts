/* eslint-disable ts/ban-ts-comment */
import type { Types } from 'tronweb'
import type {
  Amount,
  Balances,
  PrivateKey,
  TransactionID,
  TransactionResponse,
  WalletAddress,
} from './types'

import { TronWeb } from 'tronweb'
import { EVENT_SERVER, FULL_NODE, SOLIDITY_NODE, USDT_CONTRACT_ADDRESS } from '../config'
import { usdtAbi } from '../usdt-abi'
import { getTrxBalance } from './queries'

// Create a TronWeb instance
function createTronWebInstance(privateKey: PrivateKey): TronWeb {
  return new TronWeb({
    fullHost: FULL_NODE,
    solidityNode: SOLIDITY_NODE,
    eventServer: EVENT_SERVER,
    privateKey,
    headers: {
      'TRON-PRO-API-KEY': import.meta.env.VITE_TRONGRID_API_KEY,
    },
  })
}

// Send TRX
async function sendTrx(to: WalletAddress, amount: Amount, privateKey: PrivateKey): Promise<TransactionID> {
  try {
    const tronWeb = createTronWebInstance(privateKey)
    const transaction = await tronWeb.transactionBuilder.sendTrx(to, Math.floor(amount * 1e6))
    const signedTx = await tronWeb.trx.sign(transaction, privateKey)
    const broadcastTx: TransactionResponse = await tronWeb.trx.sendRawTransaction(signedTx)
    return broadcastTx.transaction.txID
  }
  catch (error) {
    console.error('Error sending TRX:', error)
    throw error
  }
}

// Send TRC20 Token
async function sendUsdt(to: WalletAddress, amount: Amount, privateKey: PrivateKey): Promise<TransactionID> {
  try {
    const tronWeb = createTronWebInstance(privateKey)
    const contract = tronWeb.contract(usdtAbi, USDT_CONTRACT_ADDRESS)
    const resp = await contract.methods.transfer(to, Math.floor(amount * 1e6)).send()
    return resp
  }
  catch (error) {
    console.error('Error sending TRC20 token:', error)
    throw error
  }
}

async function createAndSignTrc20Transaction(address: WalletAddress, amount: Amount, privateKey: PrivateKey, expiration?: number) {
  const tronWeb = createTronWebInstance(privateKey)

  const senderAddress = tronWeb.address.fromPrivateKey(privateKey)
  if (!senderAddress)
    return

  const options = {
    feeLimit: 100000000,
    callValue: 0,
  }

  const tx = await tronWeb.transactionBuilder.triggerSmartContract(
    USDT_CONTRACT_ADDRESS,
    'transfer(address,uint256)',
    options,
    [
      {
        type: 'address',
        value: address,
      },

      {
        type: 'uint256',
        value: amount * 1e6,
      },
    ],
    tronWeb.address.toHex(senderAddress),
  )

  if (expiration) {
    const extendExpirationObj = await tronWeb.transactionBuilder.extendExpiration(tx.transaction, expiration)
    Object.assign(tx, {
      transaction: extendExpirationObj,
    })
  }

  const signedTx = await tronWeb.trx.sign(tx.transaction)

  return signedTx
}

async function createAndSignTrxTransaction(address: WalletAddress, amount: Amount, privateKey: PrivateKey, expiration?: number) {
  const tronWeb = createTronWebInstance(privateKey)

  const senderAddres = tronWeb.address.fromPrivateKey(privateKey)
  if (!senderAddres)
    return

  let transaction = await tronWeb.transactionBuilder.sendTrx(address, amount * 1e6, senderAddres)

  if (expiration) {
    // @ts-expect-error
    transaction = await tronWeb.transactionBuilder.extendExpiration(transaction, expiration)
  }

  const signedTx = await tronWeb.trx.sign(transaction)

  return signedTx
}

// Fetch Balances
async function fetchBalances(address: WalletAddress, privateKey: PrivateKey): Promise<Balances> {
  if (!address) {
    throw new Error('User wallet address is required.')
  }

  try {
    const tronWeb = createTronWebInstance(privateKey)
    const trxBalance = await getTrxBalance(address)

    const contract = tronWeb.contract(usdtAbi, USDT_CONTRACT_ADDRESS)
    const usdtBalanceHex = await contract.balanceOf(address).call()
    const decimals = 6
    const usdtBalance = +tronWeb
      .toBigNumber(usdtBalanceHex)
      .div(10 ** decimals)
      .toNumber()

    return {
      TRX: trxBalance,
      USDT: usdtBalance,
    }
  }
  catch (error) {
    console.error('Error fetching balances:', error)
    return {
      TRX: 0,
      USDT: 0,
    }
  }
}

// Get Account Energy
async function getAccountEnergy(address: string, privateKey: string) {
  const tronWeb = createTronWebInstance(privateKey)

  try {
    const account = await tronWeb.trx.getAccountResources(address)
    // when the user has not spent at all energy, the API does not even send the EnergyUsed field
    const energy = account?.EnergyLimit - (account?.EnergyUsed ?? 0)

    return !Number.isNaN(energy) ? energy : 0
  }
  catch (error) {
    console.error('Error fetching account energy:', error)
    return 0
  }
}

// Get Transaction Info
async function getTransactionInfo(txid: string, privateKey: PrivateKey) {
  try {
    const tronWeb = createTronWebInstance(privateKey)
    return await tronWeb.trx.getUnconfirmedBalance(txid)
  }
  catch (error) {
    console.error('Error fetching transaction info:', error)
    throw error
  }
}

// Get Bandwidth
async function getBandwidthByAddress(address: string, privateKey: string) {
  try {
    const tronWeb = createTronWebInstance(privateKey)
    return await tronWeb.trx.getBandwidth(address)
  }
  catch (error) {
    console.error('Error fetching bandwidth:', error)
    throw error
  }
}

// Get Transaction Status
async function getTransactionStatus(transactionId: string, privateKey: string): Promise<string> {
  try {
    const tronWeb = createTronWebInstance(privateKey)
    const transaction = (await tronWeb.trx.getTransaction(transactionId)) as Types.Transaction & {
      ret: { contractRet: string }[]
    }

    const status = transaction?.ret.at(0)?.contractRet

    if (status) {
      return status
    }
    else {
      return 'PENDING'
    }
  }
  catch (error) {
    console.error('Error fetching transaction status:', error)
    return 'FAILED'
  }
}

// Create Wallet
const createWallet = () => TronWeb.createRandom()

// Restore Wallet
function restoreWallet(mnemonic: string): ReturnType<typeof TronWeb.fromMnemonic> {
  if (!mnemonic) {
    throw new Error('Mnemonic is required to restore wallet.')
  }
  return TronWeb.fromMnemonic(mnemonic)
}

export const tronService = {
  sendTrx,
  sendUsdt,
  createAndSignTrc20Transaction,
  createAndSignTrxTransaction,
  fetchBalances,
  getBandwidthByAddress,
  getAccountEnergy,
  getTransactionInfo,
  getTransactionStatus,
  createWallet,
  restoreWallet,
}
