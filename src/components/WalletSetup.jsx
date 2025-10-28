import React, { useState } from 'react';
import { useWalletStore } from '../store/walletStore';

export default function WalletSetup() {
  const [mode, setMode] = useState('create'); // 'create' | 'import-mnemonic' | 'import-key'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [importValue, setImportValue] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');
  const [error, setError] = useState('');

  const { createWallet, importWallet, loading } = useWalletStore();

  const handleCreateWallet = async () => {
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const wallet = await createWallet(password);
      setGeneratedMnemonic(wallet.mnemonic);
      setShowMnemonic(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImportWallet = async () => {
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!importValue.trim()) {
      setError('Please enter a mnemonic phrase or private key');
      return;
    }

    try {
      const type = mode === 'import-mnemonic' ? 'mnemonic' : 'privateKey';
      await importWallet(importValue.trim(), password, type);
    } catch (err) {
      setError(err.message);
    }
  };

  if (showMnemonic) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Backup Your Wallet</h2>
          <p className="text-slate-400 text-sm">
            Write down these 12 words in order and store them safely
          </p>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-yellow-300">
              <strong>Never share your recovery phrase!</strong>
              <br />
              Anyone with these words can access your funds.
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-3">
            {generatedMnemonic.split(' ').map((word, index) => (
              <div key={index} className="flex items-center space-x-2 bg-slate-900 rounded px-3 py-2">
                <span className="text-slate-500 text-xs">{index + 1}</span>
                <span className="text-white text-sm font-medium">{word}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setShowMnemonic(false);
            setGeneratedMnemonic('');
            // Wallet is already created, just close this view
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          I've Saved My Recovery Phrase
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to Dex Trader</h1>
        <p className="text-slate-400 text-sm">Create or import a wallet to get started</p>
      </div>

      {/* Mode Selection */}
      <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setMode('create')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'create'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Create New
        </button>
        <button
          onClick={() => setMode('import-mnemonic')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'import-mnemonic'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Import Phrase
        </button>
        <button
          onClick={() => setMode('import-key')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'import-key'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Import Key
        </button>
      </div>

      {/* Import Input */}
      {(mode === 'import-mnemonic' || mode === 'import-key') && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {mode === 'import-mnemonic' ? 'Recovery Phrase (12 words)' : 'Private Key (Base58)'}
          </label>
          <textarea
            value={importValue}
            onChange={(e) => setImportValue(e.target.value)}
            placeholder={mode === 'import-mnemonic' ? 'word1 word2 word3 ...' : 'Base58 encoded private key'}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
          />
        </div>
      )}

      {/* Password Inputs */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={mode === 'create' ? handleCreateWallet : handleImportWallet}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing...</span>
          </>
        ) : (
          <span>{mode === 'create' ? 'Create Wallet' : 'Import Wallet'}</span>
        )}
      </button>

      {/* Security Warning */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Security Notice:</strong> Your wallet is encrypted and stored locally in this extension. Always backup your recovery phrase and never share it with anyone.
        </p>
      </div>
    </div>
  );
}
