import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EmptyState from '../common/EmptyState';
import { TrendingUp } from 'lucide-react';

export default function TrendChart({ transactions }) {
    const trendData = useMemo(() => {
        const data = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const dayTransactions = transactions.filter(t => t.date === dateString);
            data.push({
                name: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
                income: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
                expense: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
            });
        }
        return data;
    }, [transactions]);

    return (
        <div className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-zinc-700 dark:text-zinc-200">Financial Trend (Last 30 Days)</h3>
            {transactions.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `Rp${(value/1000).toFixed(0)}k`} tick={{ fontSize: 12 }}/>
                        <Tooltip formatter={(value) => `Rp${value.toLocaleString('id-ID')}`} />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
                        <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} name="Expense" />
                    </LineChart>
                </ResponsiveContainer>
            ) : ( <div className="h-[300px] flex items-center justify-center"><EmptyState icon={<TrendingUp size={48} />} title="Not Enough Data" message="Add more transactions to see your financial trend." /></div> )}
        </div>
    );
}