/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const defaultCategories = {
  income: ['Gaji', 'Bonus', 'Hadiah', 'Investasi', 'Lainnya'],
  expense: ['Makanan & Minuman', 'Transportasi', 'Tagihan', 'Belanja', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Lainnya'],
};

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [savingsGoals, setSavingsGoals] = useLocalStorage('savingsGoals', []);
  const [categories, setCategories] = useLocalStorage('categories', defaultCategories);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // --- Notification Logic ---
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // --- Memoized Calculations ---
  const summary = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const totalSaved = savingsGoals.reduce((acc, goal) => acc + goal.currentAmount, 0);
    const balance = totalIncome - totalExpense;
    const availableBalance = balance - totalSaved;
    return { totalIncome, totalExpense, totalSaved, availableBalance };
  }, [transactions, savingsGoals]);

  // --- Handlers ---
  const addTransaction = (transaction) => { setTransactions(prev => [...prev, { ...transaction, id: Date.now() }]); showNotification('Transaction added!', 'success'); };
  const updateTransaction = (updatedTransaction) => { setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)); showNotification('Transaction updated!', 'success'); };
  const addSavingsGoal = (goal) => { setSavingsGoals(prev => [...prev, { ...goal, id: Date.now(), currentAmount: 0 }]); showNotification('Savings goal created!', 'success'); };
  const updateSavingsGoal = (updatedGoal) => { setSavingsGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g)); showNotification('Savings goal updated!', 'success'); };
  
  const handleDeleteConfirm = (type, id) => {
      if (type === 'transaction') setTransactions(prev => prev.filter(t => t.id !== id));
      else if (type === 'savingsGoal') setSavingsGoals(prev => prev.filter(g => g.id !== id));
      else if (type === 'allData') { setTransactions([]); setSavingsGoals([]); showNotification('All data has been cleared.', 'error'); }
      if(type !== 'allData') showNotification('Item deleted.', 'error');
  };

  const addFundsToGoal = (id, amount) => {
    const fundAmount = parseFloat(amount);
    if (isNaN(fundAmount) || fundAmount <= 0) { showNotification('Please enter a valid positive amount.', 'error'); return; }
    if (fundAmount > summary.availableBalance) { showNotification('Insufficient available balance.', 'error'); return; }
    setSavingsGoals(prev => prev.map(goal => goal.id === id ? { ...goal, currentAmount: goal.currentAmount + fundAmount } : goal));
    showNotification(`Rp${fundAmount.toLocaleString('id-ID')} added to your goal!`, 'success');
  };
  
  const handleCategoryUpdate = (newCategories) => { setCategories(newCategories); showNotification('Categories updated!', 'success'); };

  const value = {
    transactions,
    savingsGoals,
    categories,
    summary,
    notification,
    addTransaction,
    updateTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    handleDeleteConfirm,
    addFundsToGoal,
    handleCategoryUpdate,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};