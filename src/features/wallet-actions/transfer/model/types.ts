import { Types } from 'tronweb';

type SignedTransaction = Types.SignedTransaction & Types.Transaction<Types.ContractParamter>;

export type TransferTransactionPayloadDTO = {
  signedTrxTransaction: SignedTransaction | undefined;
  signedUsdtTransaction: SignedTransaction | undefined;
};
