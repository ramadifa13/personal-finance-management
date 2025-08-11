import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description: string;
}

interface FinanceContextType {
  transactions: Transaction[];
  goals: Goal[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, currentAmount: number) => void;
  deleteGoal: (id: string) => void;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getBalance: () => number;
  getRawBalance: () => number;
  getTotalGoalAllocations: () => number;
  getAvailableBalance: () => number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const storedTransactions = localStorage.getItem('financeTransactions');
    const storedGoals = localStorage.getItem('financeGoals');
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('financeTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('financeGoals', JSON.stringify(goals));
  }, [goals]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, currentAmount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, currentAmount } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Raw balance without goal deductions (Income - Expenses)
  const getRawBalance = () => {
    return getTotalIncome() - getTotalExpense();
  };

  // Total amount allocated to goals
  const getTotalGoalAllocations = () => {
    return goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  };

  // Available balance (what user can actually spend)
  const getAvailableBalance = () => {
    return getRawBalance() - getTotalGoalAllocations();
  };

  // Main balance shown in UI (automatically reduced by goal allocations)
  const getBalance = () => {
    return getAvailableBalance();
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        goals,
        addTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        getTotalIncome,
        getTotalExpense,
        getBalance,
        getRawBalance,
        getTotalGoalAllocations,
        getAvailableBalance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};