import React, { ReactNode } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useFinance } from '../contexts/FinanceContext';
import { 
  LayoutDashboard, 
  ArrowUpDown, 
  Target, 
  FileText, 
  Settings, 
  LogOut,
  User,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transaksi', icon: ArrowUpDown },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'reports', label: 'Laporan', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { logout, user } = useAuth();
  const { getBalance, goals } = useFinance();

  const balance = getBalance();
  const activeGoals = goals.filter(goal => (goal.currentAmount / goal.targetAmount) < 1).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyCompact = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
        notation: 'compact',
      }).format(amount);
    }
    return formatCurrency(amount);
  };

  const getCurrentPageTitle = () => {
    const item = navigationItems.find(item => item.id === currentPage);
    return item?.label || 'Dashboard';
  };

  const getBalanceIcon = () => {
    if (balance > 0) return TrendingUp;
    if (balance < 0) return TrendingDown;
    return Activity;
  };

  const BalanceIcon = getBalanceIcon();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar className="border-r border-gray-200/50">
          <SidebarContent className="bg-white flex flex-col h-full">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100">
              {/* User Profile */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{user?.name}</div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <Wallet className="w-3 h-3" />
                    <span>Personal Finance</span>
                  </div>
                </div>
              </div>
              
              {/* Balance Card */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">Saldo Tersedia</p>
                    <p className={`text-lg font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {formatCurrencyCompact(balance)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                    <BalanceIcon className={`w-4 h-4 ${
                      balance >= 0 ? 'text-green-500' : 'text-red-500'
                    }`} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <div className="flex-1 px-4 py-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`
                      relative w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                      ${currentPage === item.id 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                      currentPage === item.id ? 'text-white' : 'text-gray-500'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Goals Badge */}
                    {item.id === 'goals' && activeGoals > 0 && (
                      <Badge 
                        variant="secondary" 
                        className={`ml-auto text-xs px-2 py-1 ${
                          currentPage === item.id 
                            ? 'bg-white/20 text-white border-white/30' 
                            : 'bg-blue-100 text-blue-700 border-blue-200'
                        }`}
                      >
                        {activeGoals}
                      </Badge>
                    )}
                    
                    {/* Active indicator */}
                    {currentPage === item.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Footer - Logout Button */}
            <div className="p-4 border-t border-gray-100">
              <Button 
                variant="ghost" 
                onClick={logout} 
                className="w-full justify-start px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <LogOut className="w-4 h-4 mr-3 transition-transform group-hover:scale-105" />
                <span className="font-medium">Keluar</span>
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
          {/* Header */}
          <header className="bg-white border-b border-gray-200/60 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{getCurrentPageTitle()}</h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {currentPage === 'dashboard' && 'Ringkasan keuangan Anda'}
                    {currentPage === 'transactions' && 'Kelola semua transaksi'}
                    {currentPage === 'goals' && 'Pantau target keuangan'}
                    {currentPage === 'reports' && 'Analisis dan laporan'}
                    {currentPage === 'settings' && 'Pengaturan aplikasi'}
                  </p>
                </div>
              </div>
              
              {/* Header Balance & Stats */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Saldo Tersedia</p>
                  <p className={`text-sm font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {formatCurrency(balance)}
                  </p>
                </div>
                {activeGoals > 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    {activeGoals} Goals Aktif
                  </Badge>
                )}
              </div>
            </div>
          </header>
          
          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};