import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import StatCard from '../components/dashboard/StatCard';
import TrendChart from '../components/dashboard/TrendChart';
import ChartCard from '../components/dashboard/ChartCard';
import { ArrowUp, ArrowDown, PiggyBank } from 'lucide-react';

export default function DashboardView() {
    const { transactions, summary } = useContext(DataContext);
    const { totalIncome, totalExpense, availableBalance, totalSaved } = summary;

    const aggregateByCategory = (type) => transactions.filter(t => t.type === type).reduce((acc, t) => {
        const category = t.category || 'Lainnya';
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
    }, {});

    const incomeChartData = Object.entries(aggregateByCategory('income')).map(([name, value]) => ({ name, value }));
    const expenseChartData = Object.entries(aggregateByCategory('expense')).map(([name, value]) => ({ name, value }));
    const INCOME_COLORS = ['#10B981', '#14C98E', '#3DD6A2', '#60E2B5', '#89F1CB'];
    const EXPENSE_COLORS = ['#EF4444', '#F46A6A', '#F78B8B', '#F9ACAC', '#FCDCDD'];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Available Balance" amount={availableBalance} color="text-sky-500" borderColor="border-sky-500" subtext={`Rp${totalIncome.toLocaleString()} - Rp${totalExpense.toLocaleString()} - Rp${totalSaved.toLocaleString()}`}/>
                <StatCard title="Total Income" amount={totalIncome} color="text-green-500" icon={<ArrowUp size={24} />} borderColor="border-green-500"/>
                <StatCard title="Total Expense" amount={totalExpense} color="text-red-500" icon={<ArrowDown size={24} />} borderColor="border-red-500"/>
                <StatCard title="Total Saved" amount={totalSaved} color="text-amber-500" icon={<PiggyBank size={24} />} borderColor="border-amber-500"/>
            </div>
            <TrendChart transactions={transactions} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Income Categories" data={incomeChartData} colors={INCOME_COLORS} />
                <ChartCard title="Expense Categories" data={expenseChartData} colors={EXPENSE_COLORS} />
            </div>
        </div>
    );
}