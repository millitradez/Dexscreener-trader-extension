# Safari iOS Quick Start Guide

## Prerequisites

✅ **macOS computer** (required for Xcode)
✅ **Xcode 13+** (free from App Store)
✅ **iPhone/iPad** with iOS 15+ (or Simulator)

## 30-Second Conversion

```bash
# 1. Build the extension
npm run build

# 2. Convert to Safari (macOS only)
./scripts/convert-to-safari.sh

# 3. Open in Xcode
open safari-build/Dexscreener\ Trader/Dexscreener\ Trader.xcodeproj

# 4. In Xcode: Cmd+R to build and run
```

## Enable on iPhone

1. **Settings** → **Safari** → **Extensions**
2. Enable **Dexscreener Trader**
3. Tap extension → **Allow All Websites**

## Important Notes

⚠️ **iOS Safari has limitations:**
- No persistent background scripts
- Stricter storage limits
- No clipboard API
- Must pass App Store review ($99/year)

⚠️ **Security Warning:**
Storing private keys on mobile is risky! Consider:
- **WalletConnect** integration (recommended)
- **View-only mode** (no key storage)
- **Hardware wallet** support

## Full Documentation

See **SAFARI_IOS_GUIDE.md** for:
- Detailed conversion steps
- iOS-specific changes needed
- App Store submission guide
- Security best practices
- WalletConnect integration

## Alternative: WalletConnect (Recommended)

Instead of storing keys on mobile, integrate WalletConnect:

```bash
npm install @walletconnect/web3-provider
```

Benefits:
- ✅ Much safer (no key storage)
- ✅ Easier App Store approval
- ✅ Support multiple wallets (Phantom, etc.)
- ✅ Better user experience

## Need Help?

1. Read SAFARI_IOS_GUIDE.md
2. Check Apple's [Safari Extensions documentation](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
3. Open GitHub issue with questions

---

**Estimated Time:**
- Conversion: 30 minutes
- Testing: 2-4 hours
- App Store submission: 3-5 weeks

**Cost:**
- Apple Developer Account: $99/year
