import React, { createContext, useContext, useState } from 'react';
import { MY_PROFILE } from '@/data/mocks';

export type MonetizationStage = 'initial' | 'goals_met' | 'paid_fresh' | 'monetized_mature';

export type WithdrawalItem = {
  id: string;
  amount: number;
  method: 'Stripe' | 'Binance Pay';
  account: string;
  date: string;
  status: 'aprobado' | 'pendiente' | 'rechazado';
};

export type RevenueStreams = {
  views: number;
  liveGifts: number;
  liveBattles: number;
  subscriptions: number;
};

export type UserProfile = {
  name: string;
  username: string;
  bio: string;
  category: string;
  avatarColor: string;
};

type MonetizationContextType = {
  stage: MonetizationStage;
  goalsCompleted: boolean;
  isPaid: boolean;
  isMature: boolean;
  balance: number;
  withdrawals: WithdrawalItem[];
  revenueStreams: RevenueStreams;
  profile: UserProfile;
  simulateGoalsComplete: () => void;
  setPaid: () => void;
  simulateMatureTrajectory: () => void;
  resetDemo: () => void;
  incrementBalance: () => void;
  requestWithdrawal: (amount: number, method: 'Stripe' | 'Binance Pay', account: string) => boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
};

const DEFAULT_WITHDRAWALS: WithdrawalItem[] = [
  {
    id: 'w-101',
    amount: 16.70,
    method: 'Binance Pay',
    account: 'USDT · Pay ID 849201',
    date: 'Ayer · 16:42',
    status: 'aprobado',
  },
  {
    id: 'w-102',
    amount: 25.00,
    method: 'Stripe',
    account: 'Banco Pichincha ···4921',
    date: '04 Oct · 11:20',
    status: 'aprobado',
  },
];

const INITIAL_REVENUE_STREAMS: RevenueStreams = {
  views: 0.00,
  liveGifts: 0.00,
  liveBattles: 0.00,
  subscriptions: 0.00,
};

const MATURE_REVENUE_STREAMS: RevenueStreams = {
  views: 14.50,
  liveGifts: 28.30,
  liveBattles: 45.00,
  subscriptions: 12.00,
};

const DEFAULT_PROFILE: UserProfile = {
  name: MY_PROFILE.name,
  username: MY_PROFILE.username,
  bio: MY_PROFILE.bio,
  category: 'Comedia y Lifestyle LATAM',
  avatarColor: '#FE2C55',
};

const MonetizationContext = createContext<MonetizationContextType | null>(null);

export function MonetizationProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<MonetizationStage>('initial');
  const [balance, setBalance] = useState(0.00);
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>(DEFAULT_WITHDRAWALS);
  const [revenueStreams, setRevenueStreams] = useState<RevenueStreams>(INITIAL_REVENUE_STREAMS);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  const goalsCompleted = stage !== 'initial';
  const isPaid = stage === 'paid_fresh' || stage === 'monetized_mature';
  const isMature = stage === 'monetized_mature';

  function simulateGoalsComplete() {
    setStage('goals_met');
  }

  function setPaid() {
    setStage('paid_fresh');
    setBalance(1.20);
    setRevenueStreams({
      views: 1.20,
      liveGifts: 0.00,
      liveBattles: 0.00,
      subscriptions: 0.00,
    });
  }

  function simulateMatureTrajectory() {
    setStage('monetized_mature');
    setBalance(14.50);
    setRevenueStreams(MATURE_REVENUE_STREAMS);
  }

  function resetDemo() {
    setStage('initial');
    setBalance(0.00);
    setWithdrawals(DEFAULT_WITHDRAWALS);
    setRevenueStreams(INITIAL_REVENUE_STREAMS);
    setProfile(DEFAULT_PROFILE);
  }

  function incrementBalance() {
    setBalance(prev => Math.round((prev + 0.01) * 100) / 100);
    setRevenueStreams(prev => ({
      ...prev,
      views: Math.round((prev.views + 0.01) * 100) / 100,
    }));
  }

  function requestWithdrawal(amount: number, method: 'Stripe' | 'Binance Pay', account: string): boolean {
    if (amount <= 0 || amount > balance) return false;
    const newWithdrawal: WithdrawalItem = {
      id: `w-${Date.now().toString().slice(-4)}`,
      amount,
      method,
      account,
      date: 'Hoy · hace un momento',
      status: 'pendiente',
    };
    setWithdrawals(prev => [newWithdrawal, ...prev]);
    setBalance(prev => Math.round((prev - amount) * 100) / 100);
    return true;
  }

  function updateProfile(data: Partial<UserProfile>) {
    setProfile(prev => ({ ...prev, ...data }));
  }

  return (
    <MonetizationContext.Provider value={{
      stage,
      goalsCompleted,
      isPaid,
      isMature,
      balance,
      withdrawals,
      revenueStreams,
      profile,
      simulateGoalsComplete,
      setPaid,
      simulateMatureTrajectory,
      resetDemo,
      incrementBalance,
      requestWithdrawal,
      updateProfile,
    }}>
      {children}
    </MonetizationContext.Provider>
  );
}

export function useMonetization() {
  const ctx = useContext(MonetizationContext);
  if (!ctx) throw new Error('useMonetization must be used within MonetizationProvider');
  return ctx;
}
