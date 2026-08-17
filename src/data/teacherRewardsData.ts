import { RewardItem, RewardActivity } from '../types';

export const REWARD_ITEMS: RewardItem[] = [
  {
    id: 'rew-1',
    title: 'Free Featured Listing Spotlight Boost (7 Days)',
    costPoints: 400,
    description: 'Promote your classroom listing to the top of search results and homepage featured reel.',
    icon: 'Sparkles',
    rewardType: 'featured_listing',
    value: '7-Day Top Ranking',
  },
  {
    id: 'rew-2',
    title: '0% Platform Fee Voucher on Next 3 Sales',
    costPoints: 750,
    description: 'Keep 100% of your sale earnings with zero commission fee deducted on your next 3 transactions.',
    icon: 'Percent',
    rewardType: 'fee_discount',
    value: 'Zero Commission',
  },
  {
    id: 'rew-3',
    title: 'Verified Master Educator Profile Badge',
    costPoints: 300,
    description: 'Unlocks a gold star trust badge and priority placement in school district directory.',
    icon: 'Award',
    rewardType: 'badge',
    value: 'Gold Profile Badge',
  },
  {
    id: 'rew-4',
    title: '$15 Supply Credit towards any Marketplace Purchase',
    costPoints: 1200,
    description: 'Instant discount voucher automatically applied at checkout towards any classroom supply.',
    icon: 'Gift',
    rewardType: 'store_credit',
    value: '$15.00 Cart Credit',
  },
];

export const INITIAL_REWARD_ACTIVITIES: RewardActivity[] = [
  {
    id: 'act-1',
    date: '2026-08-05',
    description: 'Earned points for listing 3 new classroom surplus items',
    points: 150,
    type: 'earned',
  },
  {
    id: 'act-2',
    date: '2026-08-03',
    description: 'Verified Teacher credentials approved by admin',
    points: 200,
    type: 'earned',
  },
  {
    id: 'act-3',
    date: '2026-07-28',
    description: 'Completed 5-star sale transaction (Decodable Readers Set)',
    points: 100,
    type: 'earned',
  },
  {
    id: 'act-4',
    date: '2026-07-20',
    description: 'Redeemed Free 7-Day Featured Listing Spotlight',
    points: -400,
    type: 'redeemed',
  },
];
