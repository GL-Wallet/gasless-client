import { TronWeb, Types } from 'tronweb';

import { EVENT_SERVER, FULL_NODE, SOLIDITY_NODE, USDT_CONTRACT_ADDRESS } from '../config';
import { usdtAbi } from '../usdt-abi';
import { getTrxBalance } from './queries';
import {
	Amount, Balances, PrivateKey, TransactionID, TransactionResponse, WalletAddress
} from './types';

// Create a TronWeb instance
const createTronWebInstance = (privateKey: PrivateKey): TronWeb =>
  new TronWeb(FULL_NODE, SOLIDITY_NODE, EVENT_SERVER, privateKey);

// Send TRX
const sendTrx = async (to: WalletAddress, amount: Amount, privateKey: PrivateKey): Promise<TransactionID> => {
  try {
    const tronWeb = createTronWebInstance(privateKey);
    const transaction = await tronWeb.transactionBuilder.sendTrx(to, Math.floor(amount * 1e6));
    const signedTx = await tronWeb.trx.sign(transaction, privateKey);
    const broadcastTx: TransactionResponse = await tronWeb.trx.sendRawTransaction(signedTx);
    return broadcastTx.transaction.txID;
  } catch (error) {
    console.error('Error sending TRX:', error);
    throw error;
  }
};

// Send TRC20 Token
const sendUsdt = async (to: WalletAddress, amount: Amount, privateKey: PrivateKey): Promise<TransactionID> => {
  try {
    const tronWeb = createTronWebInstance(privateKey);
    const contract = tronWeb.contract(usdtAbi, USDT_CONTRACT_ADDRESS);
    const resp = await contract.methods.transfer(to, Math.floor(amount * 1e6)).send();
    return resp;
  } catch (error) {
    console.error('Error sending TRC20 token:', error);
    throw error;
  }
};

const createAndSignTrc20Transaction = async (address: WalletAddress, amount: Amount, privateKey: PrivateKey) => {
  const tronWeb = createTronWebInstance(privateKey);

  const senderAddres = tronWeb.address.fromPrivateKey(privateKey);
  if (!senderAddres) return;

  const options = {
    feeLimit: 100000000,
    callValue: 0
  };

  const tx = await tronWeb.transactionBuilder.triggerSmartContract(
    USDT_CONTRACT_ADDRESS,
    'transfer(address,uint256)',
    options,
    [
      {
        type: 'address',
        value: address
      },

      {
        type: 'uint256',
        value: amount * 1e6
      }
    ],
    tronWeb.address.toHex(senderAddres)
  );

  const signedTx = await tronWeb.trx.sign(tx.transaction);

  return signedTx;
};

const createAndSignTrxTransaction = async (address: WalletAddress, amount: Amount, privateKey: PrivateKey) => {
  const tronWeb = createTronWebInstance(privateKey);

  const senderAddres = tronWeb.address.fromPrivateKey(privateKey);
  if (!senderAddres) return;

  const transaction = await tronWeb.transactionBuilder.sendTrx(address, amount * 1e6, senderAddres);
  const signedTx = await tronWeb.trx.sign(transaction);

  return signedTx;
};

// Fetch Balances
const fetchBalances = async (address: WalletAddress, privateKey: PrivateKey): Promise<Balances> => {
  if (!address) {
    throw new Error('User wallet address is required.');
  }

  try {
    const tronWeb = createTronWebInstance(privateKey);
    const trxBalance = await getTrxBalance(address);

    const contract = tronWeb.contract(usdtAbi, USDT_CONTRACT_ADDRESS);
    const usdtBalanceHex = await contract.balanceOf(address).call();
    const decimals = 6;
    const usdtBalance = +tronWeb
      .toBigNumber(usdtBalanceHex)
      .div(10 ** decimals)
      .toNumber();

    return {
      TRX: trxBalance,
      USDT: usdtBalance
    };
  } catch (error) {
    console.error('Error fetching balances:', error);
    return {
      TRX: 0,
      USDT: 0
    };
  }
};

// Get Account Energy
const getAccountEnergy = async (address: string, privateKey: string) => {
  const tronWeb = createTronWebInstance(privateKey);

  try {
    const account = await tronWeb.trx.getAccountResources(address);
    // when the user has not spent at all energy, the API does not even send the EnergyUsed field
    const energy = account?.EnergyLimit - (account?.EnergyUsed ?? 0);

    return !isNaN(energy) ? energy : 0;
  } catch (error) {
    console.error('Error fetching account energy:', error);
    return 0;
  }
};

// Get Transaction Info
const getTransactionInfo = async (txid: string, privateKey: PrivateKey) => {
  try {
    const tronWeb = createTronWebInstance(privateKey);
    return await tronWeb.trx.getUnconfirmedBalance(txid);
  } catch (error) {
    console.error('Error fetching transaction info:', error);
    throw error;
  }
};

// Get Bandwidth
const getBandwidthByAddress = async (address: string, privateKey: string) => {
  try {
    const tronWeb = createTronWebInstance(privateKey);
    return await tronWeb.trx.getBandwidth(address);
  } catch (error) {
    console.error('Error fetching bandwidth:', error);
    throw error;
  }
};

// Get TRC20 Transaction fee
const getTrc20TransactionFee = async (address: string, privateKey: string) => {
  const tronWeb = createTronWebInstance(privateKey);

  const parameter = [
    { type: 'address', value: address },
    { type: 'uint256', value: 10 }
  ];


  console.log(TronWeb.address.toHex(USDT_CONTRACT_ADDRESS))

  const transactionWrapper = await tronWeb.transactionBuilder.triggerConstantContract(
    USDT_CONTRACT_ADDRESS,
    'transfer(address,uint256)',
    {},
    parameter,
    'THQbYWkPDChusW8gNSmrsHeM3Nd8NgrawJ'
  );

  console.log(transactionWrapper);
};

// Get Transaction Status
async function getTransactionStatus(transactionId: string, privateKey: string): Promise<string> {
  try {
    const tronWeb = createTronWebInstance(privateKey);
    const transaction = (await tronWeb.trx.getTransaction(transactionId)) as Types.Transaction & {
      ret: { contractRet: string }[];
    };

    const status = transaction?.ret.at(0)?.contractRet;

    if (status) {
      return status;
    } else {
      return 'PENDING';
    }
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    return 'FAILED';
  }
}

// Create Wallet
const createWallet = () => TronWeb.createRandom();

// Restore Wallet
const restoreWallet = (mnemonic: string): ReturnType<typeof TronWeb.fromMnemonic> => {
  if (!mnemonic) {
    throw new Error('Mnemonic is required to restore wallet.');
  }
  return TronWeb.fromMnemonic(mnemonic);
};

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
  getTrc20TransactionFee,
  createWallet,
  restoreWallet
};
