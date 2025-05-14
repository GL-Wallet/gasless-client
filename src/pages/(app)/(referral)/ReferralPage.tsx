import { useUser } from '@/entities/user'
import { useWallet } from '@/entities/wallet'
import {
  ReferralCard,
  ReferralClaimCard,
  ReferralList,
  useFetchReferrals,
} from '@/features/referral'

import { api } from '@/kernel/api'
import { Badge } from '@/shared/ui/badge'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const MemoizedReferralCard = memo(ReferralCard)

export function ReferralPage() {
  const [reward, setReward] = useState<number | null>(null)
  const [referralsCount, setReferralsCount] = useState<number | null>(null)
  const [isClaimLoading, setIsClaimLoading] = useState(false)
  const [minRewardLimit, setMinRewardLimit] = useState<number | null>(null)

  const { t } = useTranslation()

  const currentPage = useRef<number>(1)
  const limit = useRef<number>(4)

  const { referralList, hasMoreReferrals, isLoading, fetchReferralList, fetchNextReferrals } = useFetchReferrals({
    currentPage,
    pageSize: limit,
  })

  const wallet = useWallet()
  const user = useUser()

  const memoizedFetchNextReferrals = useCallback(() => {
    fetchNextReferrals()
  }, [fetchNextReferrals])

  const handleClaimReward = useCallback(async () => {
    if (!user || !minRewardLimit || (reward && reward < minRewardLimit))
      return

    try {
      setIsClaimLoading(true)
      await api.claimReward(user.id, { address: wallet.address })
      await fetchReferralList()
      toast.success('Success!')
      setReward(0)
    }
    catch {
      toast.error('Something went wrong.')
    }
    finally {
      setIsClaimLoading(false)
    }
  }, [user, minRewardLimit, reward, wallet.address, fetchReferralList])

  useEffect(() => {
    if (!user)
      return

    api.getTotalReward(user.id).then(res => setReward(res))
    api.getReferralsCount(user.id).then(res => setReferralsCount(res))
    api.getRewardLimit().then(res => setMinRewardLimit(res))
    fetchReferralList()
  }, [user, fetchReferralList])

  const isZeroReward = reward === 0

  return (
    <div className="flex-1 flex flex-col space-y-12 pt-12">
      <MemoizedReferralCard userId={user?.id} />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold primary-gradient">{t('referral.friends')}</h3>
          <div className="space-x-2 text-sm text-muted-foreground">
            <span>{t('referral.referralsInvited')}</span>
            <Badge className="border-none dark:border-neutral-700" variant="outline">
              {referralsCount ?? '...'}
            </Badge>
          </div>
        </div>

        <ReferralClaimCard
          reward={reward}
          minRewardLimit={minRewardLimit}
          isZeroReward={isZeroReward}
          isLoading={isClaimLoading}
          handleClaimReward={handleClaimReward}
        />

        <ReferralList
          className="h-48"
          referrals={referralList}
          isLoading={isLoading}
          hasMore={hasMoreReferrals}
          fetchReferrals={memoizedFetchNextReferrals}
        />
      </div>
    </div>
  )
}
