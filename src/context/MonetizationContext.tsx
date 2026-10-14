import React, { createContext, useContext, useState } from 'react';

export type MonetizationStage = 'initial' | 'goals_met' | 'paid_fresh' | 'monetized_mature';

type MonetizationContextType = {
  stage: MonetizationStage;
  goalsCompleted: boolean;
  isPaid: boolean;
  isMature: boolean;
  balance: number;
  simulateGoalsComplete: () => void;
  setPaid: () => void;
  simulateMatureTrajectory: () => void;
  resetDemo: () => void;
  incrementBalance: () => void;
};

const MonetizationContext = createContext<MonetizationContextType | null>(null);

export function MonetizationProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<MonetizationStage>('initial');
  const [balance, setBalance] = useState(0.00);

  const goalsCompleted = stage !== 'initial';
  const isPaid = stage === 'paid_fresh' || stage === 'monetized_mature';
  const isMature = stage === 'monetized_mature';

  function simulateGoalsComplete() {
    setStage('goals_met');
  }

  function setPaid() {
    setStage('paid_fresh');
    setBalance(1.20);
  }

  function simulateMatureTrajectory() {
    setStage('monetized_mature');
    setBalance(14.50);
  }

  function resetDemo() {
    setStage('initial');
    setBalance(0.00);
  }

  function incrementBalance() {
    setBalance(prev => Math.round((prev + 0.01) * 100) / 100);
  }

  return (
    <MonetizationContext.Provider value={{
      stage,
      goalsCompleted,
      isPaid,
      isMature,
      balance,
      simulateGoalsComplete,
      setPaid,
      simulateMatureTrajectory,
      resetDemo,
      incrementBalance,
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
