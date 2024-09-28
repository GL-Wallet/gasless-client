import { useCallback, useState } from 'react';

import { User, useUser } from '@/entities/user';
import { api } from '@/kernel/api';

type UseFetchReferralsProps = {
  currentPage: React.MutableRefObject<number>;
  pageSize: React.MutableRefObject<number>;
};

type UseFetchReferralsReturn = {
  referralList: User[];
  hasMoreReferrals: boolean;
  loadingReferrals: boolean;
  fetchReferralList: () => Promise<void>;
  fetchNextReferrals: () => Promise<void>;
};

export const useFetchReferrals = ({ currentPage, pageSize }: UseFetchReferralsProps): UseFetchReferralsReturn => {
  const user = useUser();

  const [referralList, setReferralList] = useState<User[]>([]);
  const [hasMoreReferrals, setHasMoreReferrals] = useState<boolean>(false);
  const [loadingReferrals, setLoadingReferrals] = useState<boolean>(false);

  const fetchReferralList = useCallback(async () => {
    if (!user) return;

    setLoadingReferrals(true);
    try {
      const response = await api.getReferrals(user?.id, { page: currentPage.current, limit: pageSize.current });
      setReferralList(response);
    } catch (error) {
      console.error('Failed to fetch referrals: ', error);
    } finally {
      setLoadingReferrals(false);
    }
  }, [currentPage, pageSize, user]);

  const fetchNextReferrals = useCallback(async () => {
    if (!user) return;

    setLoadingReferrals(true);
    try {
      const response = await api.getReferrals(user.id, { page: currentPage.current, limit: pageSize.current });
      setReferralList((prev) => [...prev, ...response]);
      setHasMoreReferrals(response.length === pageSize.current);
      if (response.length === pageSize.current) currentPage.current++;
    } catch (error) {
      console.error('Failed to fetch referrals: ', error);
    } finally {
      setLoadingReferrals(false);
    }
  }, [currentPage, pageSize, user]);

  return { referralList, hasMoreReferrals, loadingReferrals, fetchReferralList, fetchNextReferrals };
};
