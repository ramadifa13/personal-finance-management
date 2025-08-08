import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import EmptyState from '../components/common/EmptyState';
import AnimatedListItem from '../components/common/AnimatedListItem';
import { Wallet, Plus, Edit, Trash2 } from 'lucide-react';

export default function SavingsView({ openModal }) {
    const { savingsGoals, addFundsToGoal } = useContext(DataContext);
    const [fundAmount, setFundAmount] = useState({});

    const handleFundAmountChange = (id, value) => setFundAmount(prev => ({ ...prev, [id]: value }));
    const handleAddFunds = (id) => {
        const amount = fundAmount[id] || '';
        addFundsToGoal(id, amount);
        setFundAmount(prev => ({ ...prev, [id]: '' }));
    };

    return (
        <div className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-zinc-700 dark:text-zinc-200">Savings Goals</h3>
                <button onClick={() => openModal('savingsGoal')} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-transform transform hover:scale-105 shadow-md self-end sm:self-center">
                    <Plus size={20} /> <span>New Goal</span>
                </button>
            </div>
            {savingsGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savingsGoals.map((goal, index) => {
                        const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                        const remaining = goal.targetAmount - goal.currentAmount;
                        return (
                            <AnimatedListItem key={goal.id} index={index}>
                                <div className="p-5 h-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-lg text-zinc-800 dark:text-zinc-100">{goal.name}</p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Target: Rp{goal.targetAmount.toLocaleString('id-ID')}</p>
                                            <p className="text-sm font-semibold text-green-500">Saved: Rp{goal.currentAmount.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <button onClick={() => openModal('editSavings', goal)} className="text-zinc-400 hover:text-sky-500 transition-colors p-1 rounded-full"><Edit size={18} /></button>
                                            <button onClick={() => openModal('confirmDelete', { type: 'savingsGoal', id: goal.id })} className="text-zinc-400 hover:text-red-500 transition-colors p-1 rounded-full"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3"><div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div></div>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Rp{remaining > 0 ? remaining.toLocaleString('id-ID') : '0'} to go</p>
                                            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">{progress.toFixed(1)}%</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center space-x-2">
                                        <input type="number" placeholder="Add funds" value={fundAmount[goal.id] || ''} onChange={(e) => handleFundAmountChange(goal.id, e.target.value)} className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"/>
                                        <button onClick={() => handleAddFunds(goal.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Add</button>
                                    </div>
                                </div>
                            </AnimatedListItem>
                        );
                    })}
                </div>
            ) : ( <EmptyState icon={<Wallet size={48}/>} title="No Savings Goals Yet" message="Create a goal to start tracking your savings." /> )}
        </div>
    );
}