import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import { PinSetup } from './components/PinSetup';
import { PinLogin } from './components/PinLogin';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Goals } from './components/Goals';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Toaster } from './components/ui/sonner';
import { Loader2, Wallet } from 'lucide-react';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center relative overflow-hidden">
    {/* Background decorations */}
    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    
    <div className="text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
          <Wallet className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Finance</h2>
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <p className="text-gray-600">Memuat aplikasi...</p>
      </div>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { isAuthenticated, hasUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show PIN setup if no user exists
  if (!hasUser()) {
    return (
      <div className="animate-fade-in">
        <PinSetup />
      </div>
    );
  }

  // Show login if user exists but not authenticated
  if (!isAuthenticated) {
    return (
      <div className="animate-fade-in">
        <PinLogin />
      </div>
    );
  }

  // Main app content with page transitions
  const renderContent = () => {
    const pages = {
      dashboard: <Dashboard />,
      transactions: <Transactions />,
      goals: <Goals />,
      reports: <Reports />,
      settings: <Settings />,
    };

    return (
      <div key={currentPage} className="animate-fade-in">
        {pages[currentPage as keyof typeof pages] || <Dashboard />}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderContent()}
      </Layout>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <div className="min-h-screen bg-background antialiased">
          <AppContent />
          <Toaster 
            position="top-right" 
            expand={false}
            richColors
            closeButton
            toastOptions={{
              style: {
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              },
            }}
          />
        </div>
      </FinanceProvider>
    </AuthProvider>
  );
}