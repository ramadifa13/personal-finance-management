import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useFinance } from '../contexts/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
  FileText
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { transactions } = useFinance();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDateGrouping = (date: string, period: string) => {
    const d = new Date(date);
    if (period === 'monthly') {
      return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
    } else if (period === 'weekly') {
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      return `Minggu ${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
    } else {
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    }
  };

  const chartData = useMemo(() => {
    const grouped = transactions.reduce((acc, transaction) => {
      const period = getDateGrouping(transaction.date, selectedPeriod);
      if (!acc[period]) {
        acc[period] = { period, income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        acc[period].income += transaction.amount;
      } else {
        acc[period].expense += transaction.amount;
      }
      return acc;
    }, {} as Record<string, { period: string; income: number; expense: number }>);

    return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
  }, [transactions, selectedPeriod]);

  const categoryData = useMemo(() => {
    const categories = transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = { category, amount: 0, count: 0 };
      }
      acc[category].amount += transaction.amount;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { category: string; amount: number; count: number }>);

    return Object.values(categories).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories = expenses.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [transactions]);

  const summaryStats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const averageTransaction = transactions.length > 0 
      ? (totalIncome + totalExpense) / transactions.length 
      : 0;

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const thisMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === thisMonth && 
             transactionDate.getFullYear() === thisYear;
    });

    const monthlyIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpense = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      averageTransaction,
      monthlyIncome,
      monthlyExpense,
      monthlyBalance: monthlyIncome - monthlyExpense,
      totalTransactions: transactions.length
    };
  }, [transactions]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2>Laporan Keuangan</h2>
          <p className="text-muted-foreground">Analisis dan insights dari transaksi Anda</p>
        </div>
        
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3>Belum Ada Data</h3>
            <p className="text-muted-foreground">
              Tambahkan beberapa transaksi untuk melihat laporan keuangan Anda
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Laporan Keuangan</h2>
          <p className="text-muted-foreground">Analisis dan insights dari transaksi Anda</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Harian</SelectItem>
            <SelectItem value="weekly">Mingguan</SelectItem>
            <SelectItem value="monthly">Bulanan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                <p className="font-medium text-green-600">
                  {formatCurrency(summaryStats.totalIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                <p className="font-medium text-red-600">
                  {formatCurrency(summaryStats.totalExpense)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className={`font-medium ${summaryStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summaryStats.balance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                <p className="font-medium">
                  {summaryStats.totalTransactions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pemasukan vs Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="income" name="Pemasukan" fill="#10b981" />
                <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense by Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => 
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Breakdown per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((item, index) => {
              const percentage = (item.amount / summaryStats.totalExpense) * 100;
              return (
                <div key={item.category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.count} transaksi
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.amount)}</p>
                    <Badge variant="secondary">
                      {percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};