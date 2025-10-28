import React, { useState, useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';
import WalletSetup from '../components/WalletSetup';
import WalletUnlock from '../components/WalletUnlock';
import WalletDashboard from '../components/WalletDashboard';
import SwapInterface from '../components/SwapInterface';

export default function App() {
  const [view, setView] = useState('loading'); // 'loading' | 'setup' | 'unlock' | 'dashboard' | 'swap' | 'settings'
  const { wallet, isLocked, checkWalletExists } = useWalletStore();

  useEffect(() => {
    const init = async () => {
      const exists = await checkWalletExists();

      if (!exists) {
        setView('setup');
      } else if (isLocked) {
        setView('unlock');
      } else {
        setView('dashboard');
      }
    };

    init();
  }, [checkWalletExists, isLocked]);

  useEffect(() => {
    // Update view when wallet state changes
    if (wallet && !isLocked) {
      if (view === 'setup' || view === 'unlock') {
        setView('dashboard');
      }
    } else if (isLocked && view !== 'setup') {
      setView('unlock');
    }
  }, [wallet, isLocked, view]);

  if (view === 'loading') {
    return (
      <div className="popup-container bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-container bg-slate-900">
      {view === 'setup' && <WalletSetup />}
      {view === 'unlock' && <WalletUnlock />}
      {view === 'dashboard' && <WalletDashboard onNavigate={setView} />}
      {view === 'swap' && <SwapInterface onBack={() => setView('dashboard')} />}
    </div>
  );
}
