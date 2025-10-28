# Dexscreener Trader Extension v2.0

🚀 **NOW WITH BUILT-IN WALLET & REAL TRADING!**

A powerful Chrome/Edge browser extension for trading Solana tokens with a secure built-in wallet. No need for external wallet extensions - create or import your wallet directly in the extension!

## 🌟 New in v2.0

- ✅ **Built-in Encrypted Wallet** - Create or import wallets directly in the extension
- ✅ **Real Trading** - Execute swaps on Solana mainnet via Jupiter aggregator
- ✅ **Secure Storage** - Military-grade encryption (PBKDF2 + NaCl secretbox)
- ✅ **React UI** - Modern, responsive interface built with React + TailwindCSS
- ✅ **Password Protection** - Your keys are encrypted with your password
- ✅ **12-Word Recovery** - Standard BIP39 mnemonic for easy backup
- ✅ **Live Balance** - Real-time SOL balance updates
- ✅ **Transaction History** - Track your swaps (coming soon)

## Features

### Wallet Management
- **Create New Wallet**: Generate a secure 12-word recovery phrase
- **Import Wallet**: From mnemonic phrase or private key (Base58)
- **Password Protection**: AES-256 encryption with PBKDF2 key derivation
- **Auto-lock**: Wallet locks when you close the popup
- **Export Keys**: Backup your private key or mnemonic anytime

### Trading Features
- **Jupiter Integration**: Best prices through Jupiter aggregator
- **Swap Any SPL Token**: SOL, USDC, USDT, and thousands more
- **Slippage Control**: Set 0.5%, 1%, or 3% slippage tolerance
- **Real-time Quotes**: Live price updates as you type
- **Price Impact**: See how your trade affects the market
- **Transaction Links**: View completed swaps on Solscan

### Security
- **Client-Side Encryption**: Keys never leave your device
- **No Backend**: Fully decentralized, no server storage
- **Password Required**: Encrypted with 100,000 PBKDF2 iterations
- **Audit-Ready**: Open source code for security review

## Installation

### Install from Source

1. **Download the repository**
   ```bash
   git clone https://github.com/millitradez/Dexscreener-trader-extension.git
   cd Dexscreener-trader-extension
   ```

2. **Install dependencies and build**
   ```bash
   npm install
   npm run build
   ```

3. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder
   - Done! Click the extension icon

## Usage Guide

### First Time Setup

1. **Click the extension icon**
2. **Choose to Create or Import**
   - **Create New**: Generates a 12-word recovery phrase
   - **Import Phrase**: Restore from 12-word mnemonic
   - **Import Key**: Import from Base58 private key

3. **Set a strong password** (min 8 characters)
4. **IMPORTANT**: Write down your recovery phrase!

### Making Your First Swap

1. **Unlock your wallet** with your password
2. **View your SOL balance** on the dashboard
3. **Click "Swap"** button
4. **Enter swap details**
5. **Review the quote**
6. **Click "Swap Tokens"**
7. **View on Solscan**

## Security Best Practices

### DO
- ✅ Use a strong, unique password
- ✅ Write down your recovery phrase on paper
- ✅ Test with small amounts first
- ✅ Double-check addresses before swapping

### DON'T
- ❌ Share your recovery phrase
- ❌ Use for large amounts (use hardware wallet instead)
- ❌ Forget your password

## Security Architecture

```
User Password → PBKDF2 (100k iter) → Encryption Key
→ NaCl Secretbox → Encrypted Wallet → chrome.storage.local
```

## Common Tokens

| Token | Address |
|-------|---------|
| SOL | `So11111111111111111111111111111111111111112` |
| USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| USDT | `Es9vMFrzaCERmJFrLbhV4RxB3s7fFzYhw9o7PQ1q6i9L` |

## Project Structure

```
dist/                    # Built extension (load this!)
src/
  ├── popup/            # React components
  ├── wallet/           # Wallet management
  ├── utils/            # Jupiter integration
  └── store/            # State management
```

## Build Commands

```bash
npm run dev          # Development mode
npm run build        # Production build
npm run preview      # Preview build
```

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS
- Solana Web3.js
- Zustand (state)
- TweetNaCl (encryption)
- Jupiter Aggregator

## Contributing

Contributions welcome! Fork, create a feature branch, and open a PR.

## Disclaimer

⚠️ **USE AT YOUR OWN RISK**

- Beta software, not audited
- For small amounts only
- Always backup your recovery phrase
- Developers not responsible for losses

## License

MIT License

---

**Version**: 2.0.0 | **Status**: Beta

**Powered by**: [Jupiter](https://jup.ag) | [Solana](https://solana.com) | [Dexscreener](https://dexscreener.com)
