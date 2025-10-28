# Dexscreener Trader Extension

A Chrome/Edge browser extension that enables seamless trading of Solana tokens directly from Dexscreener using the Jupiter aggregator API.

## Features

- **Jupiter API Integration**: Get real-time quotes for any Solana token pair with automatic retry logic and timeout handling
- **Smart Caching**: Saves your last selected tokens and preferences using chrome.storage
- **Modern UI**: Dark-themed interface built with TailwindCSS featuring:
  - Loading spinners during API calls
  - Health indicator showing Jupiter API status
  - Input validation and error handling
  - Responsive design
- **Dexscreener Integration**:
  - Quick trade button injected on Dexscreener pages
  - One-click navigation to Dexscreener
  - Automatic token pair detection
- **Robust Error Handling**:
  - Exponential backoff retry logic (up to 3 retries)
  - 10-second timeout protection
  - Detailed error messages
- **Developer Friendly**:
  - No build step required for vanilla JS version
  - React migration ready with Vite setup
  - Well-documented codebase

## Installation

### For Windows Users

1. **Download/Clone the repository**
   ```bash
   git clone https://github.com/millitradez/Dexscreener-trader-extension.git
   cd Dexscreener-trader-extension
   ```

2. **Open Chrome/Edge**
   - Navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable **Developer mode** (toggle in top-right corner)

3. **Load the extension**
   - Click **Load unpacked**
   - Select the `Dexscreener-trader-extension` folder
   - The extension icon should appear in your browser toolbar

4. **Verify installation**
   - Click the extension icon to open the popup
   - Check that the health indicator (top-right dot) turns green
   - Green = Jupiter API is healthy and ready

### For Mac/Linux Users

Same steps as Windows, just use your terminal for step 1:
```bash
git clone https://github.com/millitradez/Dexscreener-trader-extension.git
cd Dexscreener-trader-extension
```

## Usage

### Getting Token Quotes

1. **Open the extension popup** by clicking the extension icon
2. **Enter token details**:
   - **Input Token**: Paste the Solana token mint address (e.g., SOL: `So11111111111111111111111111111111111111112`)
   - **Output Token**: Paste the destination token mint address (e.g., USDC: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)
   - **Amount**: Enter amount in smallest unit (e.g., `10000000` = 0.01 SOL)
   - **Slippage**: Set slippage tolerance in basis points (default: 50 = 0.5%)
3. **Click "Get Quote"** to fetch the current price
4. Your preferences are automatically saved for next time

### Using on Dexscreener

1. Visit any Dexscreener page (e.g., `https://dexscreener.com/solana/[pair-address]`)
2. Look for the **Quick Trade** button in the bottom-right corner
3. Click it to extract the pair information and open the extension

### Opening Dexscreener

Click the **Open DEX** button in the popup to:
- Open Dexscreener in a new tab if you're not already there
- Focus the existing Dexscreener tab if you are

## Common Token Addresses

Here are some common Solana token mint addresses for quick reference:

| Token | Mint Address |
|-------|-------------|
| SOL (Wrapped) | `So11111111111111111111111111111111111111112` |
| USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| USDT | `Es9vMFrzaCERmJFrLbhV4RxB3s7fFzYhw9o7PQ1q6i9L` |

Find more token addresses on [Dexscreener](https://dexscreener.com) or [Solana Explorer](https://explorer.solana.com/).

## Project Structure

```
├── manifest.json           # Extension configuration
├── background.js           # Service worker with API health checks
├── popup/
│   ├── popup.html         # Popup UI with TailwindCSS
│   ├── popup.js           # Popup logic and event handlers
│   └── popup.css          # Custom styles
├── content/
│   └── content.js         # Content script for Dexscreener integration
├── utils/
│   └── api.js             # API utilities with retry logic
├── icons/
│   ├── icon128.png        # Extension icon
│   └── icon.svg           # SVG source
└── package.json           # NPM dependencies for React migration
```

## Troubleshooting

### Health Indicator is Red/Yellow

- **Red**: Jupiter API is unreachable
  - Check your internet connection
  - Jupiter API may be experiencing downtime
  - Try again in a few minutes

- **Yellow**: Cannot check API health
  - Extension may need to be reloaded
  - Check browser console for errors

### "Failed after 3 attempts" Error

The extension tried 3 times with exponential backoff and couldn't reach the API:
- Check if Jupiter API is online
- Verify you have a stable internet connection
- Try using a VPN if you suspect network blocking

### Quotes are inaccurate

- The quote is real-time but not guaranteed
- Slippage setting affects final execution price
- Market volatility can cause price changes between quote and execution

### Extension not loading

1. Make sure you're loading the correct folder (should contain `manifest.json`)
2. Check Chrome console for errors: Right-click extension icon > Inspect popup
3. Try removing and re-adding the extension

## Development

### Current Setup (No Build Required)

The extension works out of the box with vanilla JavaScript:
```bash
# No build needed! Just load the extension folder in Chrome
```

### Migrating to React (Optional)

For a more robust development experience with React + TypeScript:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build with Vite**:
   ```bash
   npm run build:react
   ```

3. **Load the `dist` folder** in Chrome

See [REACT_MIGRATION.md](./REACT_MIGRATION.md) for detailed migration guide.

## API Reference

### Jupiter Quote API

The extension uses Jupiter's v6 Quote API:
```
GET https://quote-api.jup.ag/v6/quote
```

Parameters:
- `inputMint`: Input token mint address
- `outputMint`: Output token mint address
- `amount`: Amount in smallest unit
- `slippageBps`: Slippage in basis points

See [Jupiter API Docs](https://station.jup.ag/docs/apis/swap-api) for more details.

## Roadmap

- [ ] Add wallet connection (Phantom, Solflare)
- [ ] Execute trades directly from extension
- [ ] Token favorites and watchlist
- [ ] Price alerts and notifications
- [ ] Historical price charts
- [ ] Integration with Rork terminal
- [ ] Multi-chain support (EVM chains)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This extension:
- ✅ Does NOT have access to your private keys
- ✅ Does NOT execute transactions (quote-only)
- ✅ Only requests necessary permissions
- ✅ Uses HTTPS for all API calls
- ✅ Does not collect or transmit user data

**Note**: This extension currently only fetches quotes. To execute trades, you would need to connect a wallet (not yet implemented).

## License

MIT License - see LICENSE file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/millitradez/Dexscreener-trader-extension/issues)
- **Discussions**: [GitHub Discussions](https://github.com/millitradez/Dexscreener-trader-extension/discussions)

## Disclaimer

This software is provided "as is" without warranty. Use at your own risk. Always verify quotes and transactions before executing trades. The developers are not responsible for any financial losses.

---

**Built with**: JavaScript, Chrome Extensions API, Jupiter API, TailwindCSS

**Powered by**: [Jupiter Aggregator](https://jup.ag) | [Dexscreener](https://dexscreener.com)
