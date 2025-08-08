import React, { useState, useContext, useRef, useEffect } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import { DataContext } from './contexts/DataContext';
import DashboardView from './views/DashboardView';
import TransactionListView from './views/TransactionListView';
import SavingsView from './views/SavingsView';
import SettingsView from './views/SettingsView';
import Header from './components/layout/Header';
import FloatingActionButton from './components/layout/FloatingActionButton';
import ModalManager from './components/layout/ModalManager';
import Notification from './components/common/Notification';
import { Wallet, FileText, PiggyBank, Settings } from 'lucide-react';

export default function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { notification } = useContext(DataContext);
  
  const [view, setView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const navRef = useRef(null);
  const buttonRefs = useRef({});
  const [sliderStyle, setSliderStyle] = useState({});

  useEffect(() => {
    const activeButton = buttonRefs.current[view];
    if (activeButton) {
      setSliderStyle({
        left: `${activeButton.offsetLeft}px`,
        width: `${activeButton.offsetWidth}px`,
      });
    }
  }, [view]);

  const openModal = (type, data = null) => {
    setModalContent({ type, data });
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const renderView = () => {
    switch (view) {
      case 'transactions': return <TransactionListView openModal={openModal} />;
      case 'savings': return <SavingsView openModal={openModal} />;
      case 'settings': return <SettingsView openModal={openModal} />;
      case 'dashboard': default: return <DashboardView />;
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 min-h-screen font-sans text-zinc-800 dark:text-zinc-200 selection:bg-sky-500/20 transition-colors duration-300">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main>
          <nav ref={navRef} className="mb-8 relative bg-zinc-100 dark:bg-zinc-800/70 p-2 rounded-full shadow-inner flex justify-around items-center space-x-1 max-w-lg mx-auto">
             <div className="absolute top-2 bottom-2 bg-sky-600 rounded-full shadow-lg transition-all duration-300 ease-in-out" style={sliderStyle} />
            {['dashboard', 'transactions', 'savings', 'settings'].map(v => (
              <button key={v} ref={el => buttonRefs.current[v] = el} onClick={() => setView(v)} className={`relative z-10 w-full px-2 sm:px-4 py-2 rounded-full font-semibold transition-colors duration-300 text-sm focus:outline-none flex items-center justify-center gap-2 ${view === v ? 'text-white' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}>
                {v === 'dashboard' && <Wallet size={18}/>}
                {v === 'transactions' && <FileText size={18}/>}
                {v === 'savings' && <PiggyBank size={18}/>}
                {v === 'settings' && <Settings size={18}/>}
                <span className="hidden md:inline">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
              </button>
            ))}
          </nav>
          {renderView()}
        </main>
      </div>
      <FloatingActionButton onAddTransaction={() => openModal('transaction')} onAddSavingsGoal={() => openModal('savingsGoal')} />
      {isModalOpen && <ModalManager content={modalContent} onClose={closeModal} />}
      <Notification {...notification} />
    </div>
  );
}