import { create } from 'zustand';
import {
  generateWallet,
  importFromMnemonic,
  importFromPrivateKey,
  saveWallet,
  loadWallet,
  walletExists,
  deleteWallet
} from '../wallet/walletManager';
import { getSolBalance } from '../utils/jupiterSwap';

export const useWalletStore = create((set, get) => ({
  // State
  wallet: null,
  isLocked: true,
  balance: 0,
  loading: false,
  error: null,

  // Actions
  createWallet: async (password) => {
    try {
      set({ loading: true, error: null });

      const wallet = await generateWallet();
      await saveWallet(wallet, password);

      set({
        wallet,
        isLocked: false,
        loading: false
      });

      // Load balance
      get().updateBalance();

      return wallet;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  importWallet: async (source, password, type = 'mnemonic') => {
    try {
      set({ loading: true, error: null });

      let wallet;
      if (type === 'mnemonic') {
        wallet = await importFromMnemonic(source);
      } else {
        wallet = await importFromPrivateKey(source);
      }

      await saveWallet(wallet, password);

      set({
        wallet,
        isLocked: false,
        loading: false
      });

      // Load balance
      get().updateBalance();

      return wallet;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  unlockWallet: async (password) => {
    try {
      set({ loading: true, error: null });

      const wallet = await loadWallet(password);

      set({
        wallet,
        isLocked: false,
        loading: false
      });

      // Load balance
      get().updateBalance();

      return wallet;
    } catch (error) {
      set({ error: 'Incorrect password', loading: false });
      throw error;
    }
  },

  lockWallet: () => {
    set({
      wallet: null,
      isLocked: true,
      balance: 0
    });
  },

  deleteWallet: async () => {
    try {
      await deleteWallet();
      set({
        wallet: null,
        isLocked: true,
        balance: 0
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  checkWalletExists: async () => {
    const exists = await walletExists();
    return exists;
  },

  updateBalance: async () => {
    const { wallet } = get();
    if (!wallet) return;

    try {
      const balance = await getSolBalance(wallet.publicKey);
      set({ balance });
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
