import React, { useState } from 'react';
import { useWalletStore } from '../store/walletStore';

export default function WalletUnlock() {
  const [password, setPassword] = useState('');
  const { unlockWallet, loading, error, clearError } = useWalletStore();

  const handleUnlock = async (e) => {
    e.preventDefault();
    clearError();

    if (!password) {
      return;
    }

    try {
      await unlockWallet(password);
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400 text-sm">Enter your password to unlock your wallet</p>
      </div>

      <form onSubmit={handleUnlock} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoFocus
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Unlocking...</span>
            </>
          ) : (
            <span>Unlock Wallet</span>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-xs text-slate-500">
          Forgot your password? You'll need to restore from your recovery phrase.
        </p>
      </div>
    </div>
  );
}
