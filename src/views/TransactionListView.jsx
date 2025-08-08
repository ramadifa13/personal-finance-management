/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import FormSelect from '../components/common/FormSelect';
import EmptyState from '../components/common/EmptyState';
import AnimatedListItem from '../components/common/AnimatedListItem';
import { SlidersHorizontal, FileText, ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';

export default function TransactionListView({ openModal }) {
    const { transactions, categories, handleDeleteConfirm } = useContext(DataContext);
    const [filter, setFilter] = useState('all');

    const filteredTransactions = useMemo(() => {
        if (filter === 'all') return transactions;
        return transactions.filter(t => t.category === filter);
    }, [filter, transactions]);

    return (
        <div className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-zinc-700 dark:text-zinc-200">Transaction History</h3>
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-zinc-500" />
                    <FormSelect id="filter" value={filter} onChange={e => setFilter(e.target.value)} className="w-full sm:w-auto !p-2 !text-sm">
                        <option value="all">All Categories</option>
                        <optgroup label="Income">{categories.income.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
                        <optgroup label="Expense">{categories.expense.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
                    </FormSelect>
                </div>
            </div>
            <div className="space-y-3">
                {filteredTransactions.length > 0 ? (
                    [...filteredTransactions].reverse().map((t, index) => (
                        <AnimatedListItem key={t.id} index={index}>
                            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors duration-200">
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className={`p-3 rounded-full ${t.type === 'income' ? 'bg-green-100 dark:bg-green-500/20 text-green-500' : 'bg-red-100 dark:bg-red-500/20 text-red-500'}`}>
                                        {t.type === 'income' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-zinc-800 dark:text-zinc-100 text-sm sm:text-base">{t.description}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">{new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</p>
                                            <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
                                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full">{t.category}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 sm:space-x-3">
                                    <p className={`font-bold text-sm sm:text-lg ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.type === 'income' ? '+' : '-'}Rp{t.amount.toLocaleString('id-ID')}
                                    </p>
                                    <button onClick={() => openModal('editTransaction', t)} className="text-zinc-400 hover:text-sky-500 transition-colors p-1 rounded-full"><Edit size={18} /></button>
                                    <button onClick={() => openModal('confirmDelete', { type: 'transaction', id: t.id })} className="text-zinc-400 hover:text-red-500 transition-colors p-1 rounded-full"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </AnimatedListItem>
                    ))
                ) : ( <EmptyState icon={<FileText size={48}/>} title="No Transactions Found" message={filter === 'all' ? "Click '+' to add a transaction." : "No transactions match the current filter."} /> )}
            </div>
        </div>
    );
}