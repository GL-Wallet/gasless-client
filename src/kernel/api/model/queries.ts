import { axiosInstance } from '@/shared/lib/axios';
import { User } from '@/entities/user';
import {
  ClaimRewardResponse,
  ExchangeInfoResponse,
  ExchangeResponse,
  TransferInfoResponse,
  TransferResponse
} from './types';

export const api = {
  transfer: async <T>(data: T) => (await axiosInstance.post('/transfer', data)).data as TransferResponse,
  transferInfo: async (address: string) =>
    (await axiosInstance.get(`/transfer/info/${address}`)).data as TransferInfoResponse,

  exchange: async <T>(data: T) => (await axiosInstance.post('/exchange', data)).data as ExchangeResponse,
  exchangeInfo: async () => (await axiosInstance.get('/exchange/info')).data as ExchangeInfoResponse,

  claimReward: async <T>(data: T) => (await axiosInstance.post('/referral/claim', data)).data as ClaimRewardResponse,
  getTotalReward: async () => (await axiosInstance.get('/referral/rewards')).data as number,

  getReferrals: async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = { page: 1, limit: 10 }) =>
    (await axiosInstance.get('/referral/referrals', { params: { page, limit } })).data as User[],
  getReferralsCount: async () => (await axiosInstance.get('/referral/referrals/count')).data as number,

  getEnergyRequirementsByAddress: async (address: string) =>
    (await axiosInstance.get(`/energy/requirements/${address}`)).data as number,

  getBankAddress: async () => (await axiosInstance.get('/config/address')).data as string
};
