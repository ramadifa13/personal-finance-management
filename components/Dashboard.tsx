import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useFinance } from '../contexts/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  ArrowUpCircle,
  ArrowDownCircle,
  PiggyBank,
  Activity,
  Calendar
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    getTotalIncome, 
    getTotalExpense, 
    getBalance,
    getRawBalance,
    getTotalGoalAllocations,
    transactions, 
    goals 
  } = useFinance();

  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const balance = getBalance(); // Saldo tersedia (sudah dikurangi goals)
  const rawBalance = getRawBalance(); // Saldo kotor (income - expense)
  const totalGoalAllocations = getTotalGoalAllocations();
  
  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getBalanceChangeIndicator = () => {
    if (balance > 0) return { color: 'text-green-600', icon: TrendingUp, trend: '+' };
    if (balance < 0) return { color: 'text-red-500', icon: TrendingDown, trend: '-' };
    return { color: 'text-gray-500', icon: Activity, trend: '' };
  };

  const balanceIndicator = getBalanceChangeIndicator();

  return (
    <div className="space-y-8">
      {/* Hero Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Saldo Tersedia */}
        <Card className="relative overflow-hidden hover-lift border-0 shadow-card bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Saldo Tersedia</CardTitle>
            <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
              <Wallet className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
              {formatCurrency(balance)}
            </div>
            <div className="flex items-center mt-2 space-x-1">
              <balanceIndicator.icon className={`w-4 h-4 ${balanceIndicator.color}`} />
              <p className="text-xs text-gray-600">
                Siap digunakan
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dana di Goals */}
        <Card className="relative overflow-hidden hover-lift border-0 shadow-card bg-gradient-to-br from-purple-50 to-pink-100">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Dana di Goals</CardTitle>
            <div className="p-2 bg-purple-500 rounded-xl shadow-lg">
              <PiggyBank className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalGoalAllocations)}
            </div>
            <div className="flex items-center mt-2 space-x-1">
              <Target className="w-4 h-4 text-purple-500" />
              <p className="text-xs text-gray-600">
                Dialokasikan
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pemasukan */}
        <Card className="relative overflow-hidden hover-lift border-0 shadow-card bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Pemasukan</CardTitle>
            <div className="p-2 bg-green-500 rounded-xl shadow-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <div className="flex items-center mt-2 space-x-1">
              <ArrowUpCircle className="w-4 h-4 text-green-500" />
              <p className="text-xs text-gray-600">
                Total masuk
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pengeluaran */}
        <Card className="relative overflow-hidden hover-lift border-0 shadow-card bg-gradient-to-br from-red-50 to-orange-100">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Pengeluaran</CardTitle>
            <div className="p-2 bg-red-500 rounded-xl shadow-lg">
              <TrendingDown className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(totalExpense)}
            </div>
            <div className="flex items-center mt-2 space-x-1">
              <ArrowDownCircle className="w-4 h-4 text-red-500" />
              <p className="text-xs text-gray-600">
                Total keluar
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <Card className="border-0 shadow-elegant bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Activity className="w-4 h-4 text-gray-600" />
                </div>
                <span>Transaksi Terbaru</span>
              </CardTitle>
              <Badge variant="outline" className="bg-gray-50">
                {transactions.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada transaksi</p>
                <p className="text-sm text-gray-400 mt-1">Mulai tambahkan transaksi pertama Anda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={transaction.id} className={`
                    flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-gray-50
                    ${index === 0 ? 'bg-blue-50/50 border border-blue-100' : ''}
                  `}>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpCircle className="w-5 h-5" />
                        ) : (
                          <ArrowDownCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(transaction.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`text-right`}>
                      <div className={`font-bold text-lg ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card className="border-0 shadow-elegant bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <span>Progress Goals</span>
              </CardTitle>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {goals.length} Goals
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada goals</p>
                <p className="text-sm text-gray-400 mt-1">Buat target keuangan pertama Anda</p>
              </div>
            ) : (
              <div className="space-y-6">
                {goals.slice(0, 3).map((goal, index) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  const isCompleted = progress >= 100;
                  
                  return (
                    <div key={goal.id} className={`
                      p-4 rounded-xl transition-all duration-200 
                      ${isCompleted 
                        ? 'bg-green-50 border border-green-200' 
                        : index === 0 
                          ? 'bg-blue-50/50 border border-blue-100' 
                          : 'hover:bg-gray-50'
                      }
                    `}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}>
                            <Target className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">{goal.title}</span>
                            {isCompleted && (
                              <Badge className="ml-2 bg-green-500 text-white text-xs">
                                Selesai
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-600">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Progress 
                          value={Math.min(progress, 100)} 
                          className={`h-3 ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}
                        />
                        <div className="flex justify-between text-sm">
                          <span className={`font-medium ${
                            isCompleted ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {formatCurrency(goal.currentAmount)}
                          </span>
                          <span className="text-gray-500">
                            {formatCurrency(goal.targetAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {goals.length > 3 && (
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      dan <span className="font-semibold text-purple-600">{goals.length - 3}</span> goals lainnya...
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};