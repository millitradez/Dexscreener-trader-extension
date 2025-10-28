import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { encrypt, decrypt, hashPassword } from './encryption';

const STORAGE_KEY = 'encrypted_wallet';
const PASSWORD_HASH_KEY = 'password_hash';

/**
 * Generate a new wallet with mnemonic
 */
export async function generateWallet() {
  // Generate 12-word mnemonic
  const mnemonic = bip39.generateMnemonic(128); // 128 bits = 12 words

  // Derive seed from mnemonic
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // Use first 32 bytes as keypair seed
  const keypairSeed = seed.slice(0, 32);
  const keypair = Keypair.fromSeed(keypairSeed);

  return {
    mnemonic,
    publicKey: keypair.publicKey.toBase58(),
    secretKey: bs58.encode(keypair.secretKey)
  };
}

/**
 * Import wallet from mnemonic
 */
export async function importFromMnemonic(mnemonic) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const keypairSeed = seed.slice(0, 32);
  const keypair = Keypair.fromSeed(keypairSeed);

  return {
    mnemonic,
    publicKey: keypair.publicKey.toBase58(),
    secretKey: bs58.encode(keypair.secretKey)
  };
}

/**
 * Import wallet from private key (base58)
 */
export function importFromPrivateKey(privateKeyBase58) {
  try {
    const secretKey = bs58.decode(privateKeyBase58);
    const keypair = Keypair.fromSecretKey(secretKey);

    return {
      mnemonic: null, // No mnemonic for imported private keys
      publicKey: keypair.publicKey.toBase58(),
      secretKey: privateKeyBase58
    };
  } catch (error) {
    throw new Error('Invalid private key format');
  }
}

/**
 * Save encrypted wallet to chrome.storage
 */
export async function saveWallet(wallet, password) {
  try {
    // Create password hash for future verification
    const passwordHash = await hashPassword(password);

    // Encrypt wallet data
    const walletJson = JSON.stringify(wallet);
    const encrypted = await encrypt(walletJson, password);

    // Save to chrome.storage.local
    await chrome.storage.local.set({
      [STORAGE_KEY]: encrypted,
      [PASSWORD_HASH_KEY]: passwordHash,
      walletExists: true
    });

    return true;
  } catch (error) {
    console.error('Failed to save wallet:', error);
    throw new Error('Failed to save wallet');
  }
}

/**
 * Load and decrypt wallet from chrome.storage
 */
export async function loadWallet(password) {
  try {
    // Get encrypted data from storage
    const result = await chrome.storage.local.get([STORAGE_KEY, PASSWORD_HASH_KEY]);

    if (!result[STORAGE_KEY]) {
      throw new Error('No wallet found');
    }

    // Decrypt wallet data
    const decrypted = await decrypt(result[STORAGE_KEY], password);
    const wallet = JSON.parse(decrypted);

    return wallet;
  } catch (error) {
    console.error('Failed to load wallet:', error);
    throw new Error('Failed to load wallet - incorrect password?');
  }
}

/**
 * Check if wallet exists
 */
export async function walletExists() {
  try {
    const result = await chrome.storage.local.get(['walletExists']);
    return result.walletExists === true;
  } catch (error) {
    return false;
  }
}

/**
 * Delete wallet (careful!)
 */
export async function deleteWallet() {
  await chrome.storage.local.remove([STORAGE_KEY, PASSWORD_HASH_KEY, 'walletExists']);
}

/**
 * Get keypair from wallet data
 */
export function getKeypair(wallet) {
  const secretKey = bs58.decode(wallet.secretKey);
  return Keypair.fromSecretKey(secretKey);
}

/**
 * Export wallet data (for backup)
 */
export function exportWallet(wallet) {
  return {
    publicKey: wallet.publicKey,
    privateKey: wallet.secretKey,
    mnemonic: wallet.mnemonic
  };
}
