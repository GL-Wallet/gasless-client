import { User } from '@/entities/user';
import {
  ClaimRewardResponse,
  ExchangeInfoResponse,
  ExchangeResponse,
  TransferInfoResponse,
  TransferResponse
} from './types';
import { axiosInstance } from '@/shared/lib/axios';

export const api = {
  transferInfo: async () => (await axiosInstance.get('/transfer/info')).data as TransferInfoResponse,
  exchangeInfo: async () => (await axiosInstance.get('/exchange/info')).data as ExchangeInfoResponse,
  transfer: async <T>(data: T) => (await axiosInstance.post('/transfer', data)).data as TransferResponse,
  exchange: async <T>(data: T) => (await axiosInstance.post('/exchange', data)).data as ExchangeResponse,
  claimReward: async <T>(data: T) => (await axiosInstance.post('/referral/claim', data)).data as ClaimRewardResponse,
  getTotalReward: async () => (await axiosInstance.get('/referral/rewards')).data as number,
  getReferralsCount: async () => (await axiosInstance.get('/referral/referrals/count')).data as number,
  getReferrals: async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = { page: 1, limit: 10 }) =>
    (await axiosInstance.get('/referral/referrals', { params: { page, limit } })).data as User[]
};
