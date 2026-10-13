import React, { createContext, useContext, useState, useRef } from 'react';

type MonetizationContextType = {
  goalsCompleted: boolean;
  simulateGoalsComplete: () => void;
  isPaid: boolean;
  setPaid: () => void;
  balance: number;
  incrementBalance: () => void;
};

const MonetizationContext = createContext<MonetizationContextType | null>(null);

export function MonetizationProvider({ children }: { children: React.ReactNode }) {
  const [goalsCompleted, setGoalsCompleted] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [balance, setBalance] = useState(14.50);

  function simulateGoalsComplete() {
    setGoalsCompleted(true);
  }

  function setPaid() {
    setIsPaid(true);
  }

  function incrementBalance() {
    setBalance(prev => Math.round((prev + 0.01) * 100) / 100);
  }

  return (
    <MonetizationContext.Provider value={{
      goalsCompleted,
      simulateGoalsComplete,
      isPaid,
      setPaid,
      balance,
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
