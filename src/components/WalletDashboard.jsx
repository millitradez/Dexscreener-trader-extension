import React, { useEffect, useState } from 'react';
import { useWalletStore } from '../store/walletStore';

export default function WalletDashboard({ onNavigate }) {
  const { wallet, balance, updateBalance, lockWallet } = useWalletStore();
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Update balance every 30 seconds
    const interval = setInterval(() => {
      updateBalance();
    }, 30000);

    // Initial balance load
    updateBalance();

    return () => clearInterval(interval);
  }, [updateBalance]);

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h1 className="text-lg font-bold text-white">Dex Trader</h1>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
              <button
                onClick={() => {
                  lockWallet();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-t-lg"
              >
                Lock Wallet
              </button>
              <button
                onClick={() => {
                  onNavigate('settings');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-b-lg"
              >
                Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Balance Card */}
      <div className="mx-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="text-sm opacity-80 mb-2">Total Balance</div>
        <div className="text-3xl font-bold mb-4">
          {balance.toFixed(4)} SOL
        </div>
        <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
          <span className="text-sm font-mono">{formatAddress(wallet.publicKey)}</span>
          <button
            onClick={copyAddress}
            className="ml-auto p-1 hover:bg-white/20 rounded transition-colors"
            title="Copy address"
          >
            {copied ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('swap')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>Swap</span>
        </button>
        <button
          onClick={() => window.open('https://dexscreener.com/solana', '_blank')}
          className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>DEX</span>
        </button>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="mx-4 mt-6">
        <h2 className="text-sm font-semibold text-slate-400 mb-3">Recent Activity</h2>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-slate-500">No transactions yet</p>
        </div>
      </div>
    </div>
  );
}
