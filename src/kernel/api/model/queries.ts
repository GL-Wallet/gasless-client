import { User } from '@/entities/user';
import { axiosInstance } from '@/shared/lib/axios';

import {
	ClaimRewardResponse, ExchangeInfoResponse, ExchangeResponse, TransferInfoResponse,
	TransferResponse
} from './types';

export const api = {
  transfer: async <T>(id: string, data: T) =>
    (await axiosInstance.post(`/transfer/${id}`, data)).data as TransferResponse,
  transferInfo: async (address: string) =>
    (await axiosInstance.get(`/transfer/info/${address}`)).data as TransferInfoResponse,

  exchange: async <T>(data: T) => (await axiosInstance.post('/exchange', data)).data as ExchangeResponse,
  exchangeInfo: async () => (await axiosInstance.get('/exchange/info')).data as ExchangeInfoResponse,

  claimReward: async <T>(id: string, data: T) =>
    (await axiosInstance.post(`/referral/claim/${id}`, data)).data as ClaimRewardResponse,
  getTotalReward: async (id: string) => (await axiosInstance.get(`/referral/rewards/${id}`)).data as number,
  getRewardLimit: async () => (await axiosInstance.get(`/referral/limit`)).data as number,

  getReferrals: async (
    id: string,
    { page = 1, limit = 10 }: { page?: number; limit?: number } = { page: 1, limit: 10 }
  ) => (await axiosInstance.get(`/referral/referrals/${id}`, { params: { page, limit } })).data as User[],
  getReferralsCount: async (id: string) => (await axiosInstance.get(`/referral/referrals/count/${id}`)).data as number,

  getEnergyRequirementsByAddress: async (address: string) =>
    (await axiosInstance.get(`/energy/requirements/${address}`)).data as number,
  getEnergyCountByAddress: async (address: string) =>
    (await axiosInstance.get(`/energy/count/${address}`)).data as number,

  getBankAddress: async () => (await axiosInstance.get('/config/address')).data as string
};
