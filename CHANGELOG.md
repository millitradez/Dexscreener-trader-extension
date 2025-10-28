# Changelog

All notable changes to the Dexscreener Trader Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-10-28

### 🚀 MAJOR RELEASE - Built-in Wallet & Real Trading!

This is a complete rewrite with React and includes REAL trading capabilities!

#### Added

##### Wallet Features
- **Built-in Encrypted Wallet** - Create or import wallets directly in extension
- **12-Word Mnemonic** - BIP39 standard recovery phrase generation
- **Private Key Import** - Import existing wallets via Base58 private key
- **Password Protection** - PBKDF2 (100k iterations) + NaCl encryption
- **Auto-lock** - Wallet automatically locks when popup closes
- **Balance Display** - Real-time SOL balance with auto-refresh
- **Address Management** - Copy address, view on explorer

##### Trading Features
- **Real Swap Execution** - Execute trades on Solana mainnet
- **Jupiter Swap API** - Get best prices across all DEXs
- **Transaction Signing** - Sign and send transactions from built-in wallet
- **Slippage Control** - Preset slippage (0.5%, 1%, 3%)
- **Real-time Quotes** - Live price updates as you type
- **Price Impact Display** - See how your trade affects the market
- **Transaction Confirmation** - Wait for on-chain confirmation
- **Solscan Links** - View completed transactions on Solscan

##### UI Improvements
- **React 18 Migration** - Complete rewrite with React
- **Modern Design** - Gradient cards, animations, smooth transitions
- **Loading States** - Spinners and status messages during operations
- **Error Handling** - Beautiful error messages with actionable info
- **Multi-view Navigation** - Setup → Unlock → Dashboard → Swap
- **Responsive Layout** - Optimized for extension popup size

##### Security
- **Client-Side Encryption** - Keys never transmitted or stored plaintext
- **Password Hash Verification** - SHA-256 hash for password validation
- **No Backend** - Fully decentralized, no server dependencies
- **Secure Storage** - chrome.storage.local with encryption
- **Recovery Phrase Display** - One-time display with warnings
- **Security Warnings** - Clear disclaimers about risks

##### Developer Experience
- **Vite Build System** - Fast builds with hot module replacement
- **Zustand State Management** - Simple, efficient state handling
- **Component Architecture** - Reusable React components
- **TypeScript Support** - Type definitions for Chrome APIs
- **PostCSS + Tailwind** - Utility-first CSS framework
- **Modular Code** - Clean separation of concerns

#### Changed

##### Breaking Changes
- **Build Required** - Now requires `npm run build` to create dist folder
- **No Content Script** - Removed Dexscreener integration (for now)
- **Different File Structure** - Moved to src/ directory structure

##### Updated
- **manifest.json** - Updated to v2.0.0, added alarms permission
- **package.json** - Added React, Solana, encryption dependencies
- **vite.config.js** - Optimized for Chrome extension builds
- **README.md** - Completely rewritten for v2.0

#### Technical Details

##### New Dependencies
- `react@18.2.0` - UI framework
- `react-dom@18.2.0` - React DOM rendering
- `@solana/web3.js@1.87.6` - Solana blockchain interaction
- `@solana/spl-token@0.3.9` - SPL token support
- `zustand@4.4.7` - State management
- `tweetnacl@1.0.3` - Encryption library
- `bip39@3.1.0` - Mnemonic generation
- `bs58@5.0.0` - Base58 encoding

##### New Files
- `src/popup/App.jsx` - Main React app
- `src/popup/main.jsx` - React entry point
- `src/components/WalletSetup.jsx` - Create/import wallet
- `src/components/WalletUnlock.jsx` - Unlock wallet
- `src/components/WalletDashboard.jsx` - Balance and navigation
- `src/components/SwapInterface.jsx` - Trading interface
- `src/wallet/encryption.js` - Encryption utilities
- `src/wallet/walletManager.js` - Wallet CRUD operations
- `src/utils/jupiterSwap.js` - Jupiter API integration
- `src/store/walletStore.js` - Zustand state store
- `src/background.js` - Service worker
- `src/index.css` - Global styles
- `popup.html` - HTML entry point
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

##### Removed Files
- `popup/popup.js` (vanilla) - Replaced with React
- `popup/popup.html` (vanilla) - Replaced with React
- `popup/popup.css` (vanilla) - Replaced with Tailwind
- `content/content.js` - Temporarily removed
- `utils/api.js` (vanilla) - Replaced with jupiterSwap.js

#### Security Considerations

⚠️ **Important Disclaimers**
- Browser extensions can be vulnerable to attacks
- Use only for small amounts
- Always backup recovery phrase
- Not audited by third-party security firms
- Developer not responsible for losses

#### Migration from v1.0

If you're upgrading from v1.0:
1. Export any saved preferences (they will be lost)
2. Pull latest code
3. Run `npm install` and `npm run build`
4. Load `dist` folder in Chrome
5. Create or import your wallet

## [1.0.0] - 2025-10-28

### Added

#### Core Functionality
- Jupiter API integration with v6 Quote API
- Real-time token quote fetching for Solana tokens
- Automatic retry logic with exponential backoff (up to 3 retries)
- 10-second timeout protection for API calls
- Comprehensive error handling with user-friendly messages

#### User Interface
- Modern dark-themed popup UI using TailwindCSS
- Loading spinner animations during API calls
- Health indicator showing Jupiter API status (green/yellow/red)
- Input fields for custom token mint addresses
- Amount and slippage configuration
- "Get Quote" button with loading states
- "Open DEX" button for quick Dexscreener access
- Real-time validation for all input fields
- Error display section with styled error messages
- Quote result display with formatted JSON output

#### Storage & Preferences
- chrome.storage integration for persisting user preferences
- Auto-save token addresses, amounts, and slippage settings
- Auto-load previously saved preferences on popup open

#### Dexscreener Integration
- Content script injection on Dexscreener pages
- Floating "Quick Trade" button on Dexscreener
- Automatic token pair detection from Dexscreener URLs
- URL change monitoring for SPA navigation
- Token pair metadata extraction

#### Developer Experience
- Modular code structure with separate utils/api.js
- No build step required for vanilla JS version
- React migration preparation with Vite setup
- Comprehensive inline code documentation
- Clean separation of concerns (background, popup, content, utils)

#### Documentation
- Comprehensive README.md with installation instructions
- Troubleshooting section for common issues
- API reference documentation
- Common token address reference table
- React migration guide (REACT_MIGRATION.md)
- This CHANGELOG.md file

#### Configuration
- Extension manifest v3 configuration
- Proper permissions setup (storage, activeTab, scripting, tabs)
- Host permissions for Dexscreener and Jupiter API
- Extension icon (128x128 PNG and SVG)
- .gitignore for clean repository

### Technical Details

#### Files Added
- `manifest.json` - Extension configuration
- `background.js` - Service worker with health checks
- `popup/popup.html` - Popup UI with TailwindCSS
- `popup/popup.js` - Popup logic and event handlers
- `popup/popup.css` - Custom styles
- `content/content.js` - Content script for Dexscreener
- `utils/api.js` - API utilities with retry logic
- `icons/icon128.png` - Extension icon (PNG)
- `icons/icon.svg` - Extension icon (SVG source)
- `package.json` - NPM dependencies for React migration
- `vite.config.js` - Vite configuration for future React builds
- `README.md` - Comprehensive documentation
- `REACT_MIGRATION.md` - React migration guide
- `CHANGELOG.md` - This file
- `.gitignore` - Git ignore configuration

#### Permissions Required
- `storage` - For saving user preferences
- `activeTab` - For interacting with the current tab
- `scripting` - For content script injection
- `tabs` - For managing browser tabs
- Host access to `https://*.dexscreener.com/*`
- Host access to `https://quote-api.jup.ag/*`

### Security
- No wallet integration (quote-only functionality)
- No access to private keys
- HTTPS-only API calls
- No data collection or transmission
- Minimal permissions model

### Known Limitations
- Quote-only (no trade execution)
- Solana tokens only
- Requires manual token mint address input
- No historical price data
- No wallet connection

## [Unreleased]

### Planned Features
- Wallet connection (Phantom, Solflare)
- Direct trade execution
- Token favorites and watchlist
- Price alerts and notifications
- Historical price charts
- Integration with Rork terminal
- Multi-chain support (EVM chains)
- Token search by name/symbol
- Real-time price updates
- Transaction history

---

## Version Numbering

We use Semantic Versioning (SemVer):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

## How to Update Version

1. Update `version` in `manifest.json`
2. Update `version` in `package.json`
3. Add new entry to this CHANGELOG.md
4. Commit changes: `git commit -m "chore: bump version to X.Y.Z"`
5. Create git tag: `git tag vX.Y.Z`
6. Push with tags: `git push && git push --tags`
