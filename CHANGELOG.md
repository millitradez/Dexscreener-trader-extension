# Changelog

All notable changes to the Dexscreener Trader Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
