import { useCallback, useState } from 'react';

import { UserData, useUser } from '@/entities/user';
import { api } from '@/kernel/api';

type UseFetchReferralsProps = {
  currentPage: React.MutableRefObject<number>;
  pageSize: React.MutableRefObject<number>;
};

type UseFetchReferralsReturn = {
  referralList: UserData[];
  hasMoreReferrals: boolean;
  isLoading: boolean;
  fetchReferralList: () => Promise<void>;
  fetchNextReferrals: () => Promise<void>;
};

export const useFetchReferrals = ({ currentPage, pageSize }: UseFetchReferralsProps): UseFetchReferralsReturn => {
  const user = useUser();

  const [referralList, setReferralList] = useState<UserData[]>([]);
  const [hasMoreReferrals, setHasMoreReferrals] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchReferralList = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await api.getReferrals(user?.id, { page: currentPage.current, limit: pageSize.current });

      if (!response) return;

      setReferralList(response);
      setHasMoreReferrals(response?.length === pageSize?.current);
      if (response?.length === pageSize?.current) currentPage.current++;
    } catch (error) {
      console.error('Failed to fetch referrals: ', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, user]);

  const fetchNextReferrals = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setHasMoreReferrals(false);
    try {
      const response = await api.getReferrals(user.id, { page: currentPage.current, limit: pageSize.current });

      if (!response) return;
      
      setReferralList((prev) => [...prev, ...response]);
      setHasMoreReferrals(response.length === pageSize.current);
      if (response.length === pageSize.current) currentPage.current++;
    } catch (error) {
      console.error('Failed to fetch referrals: ', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, user]);

  return { referralList, hasMoreReferrals, isLoading, fetchReferralList, fetchNextReferrals };
};
