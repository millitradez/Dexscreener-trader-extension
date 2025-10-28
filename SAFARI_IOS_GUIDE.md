# Converting to Safari Extension for iPhone

This guide explains how to convert the Dexscreener Trader Extension to work on Safari for iPhone/iPad.

## ⚠️ Important Considerations

### iOS Limitations
Safari extensions on iOS have significant restrictions:
- ❌ **No persistent background scripts** - Service workers don't persist
- ❌ **Limited storage** - More restrictive than desktop
- ❌ **No clipboard API** - Can't programmatically copy addresses
- ❌ **Stricter CSP** - Content Security Policy restrictions
- ⚠️ **Smaller screen** - UI needs to be mobile-optimized
- ⚠️ **Touch interactions** - No hover states
- ⚠️ **App Store review** - Must pass Apple's strict guidelines

### Security Concerns for iOS
- **Storing private keys on mobile devices is VERY RISKY**
- iOS is more secure than Android, but still vulnerable
- Users should only use for small amounts
- Consider making it "view-only" for iOS (no private key storage)
- Or require hardware wallet connection (Ledger, etc.)

### Recommended Approach
**Option 1: View-Only Mode (Recommended)**
- Remove wallet creation/import
- Connect to external wallets via WalletConnect
- Much safer for users
- Easier App Store approval

**Option 2: Full Wallet (Not Recommended)**
- Keep encrypted wallet functionality
- Add extra warnings
- Require biometric authentication
- Limit to small amounts

---

## Prerequisites

### Required
- **macOS computer** (Xcode only runs on macOS)
- **Xcode 13+** (free from Mac App Store)
- **Apple Developer Account** ($99/year to publish)
- **iPhone/iPad** for testing (or iOS Simulator)

### Optional
- **Safari Technology Preview** for testing
- **TestFlight** for beta testing

---

## Conversion Process

### Step 1: Install Xcode
```bash
# Install Xcode from Mac App Store
# Or use command line tools:
xcode-select --install
```

### Step 2: Prepare the Extension

First, we need to make the manifest Safari-compatible:

**Create `manifest-safari.json`:**
```json
{
  "manifest_version": 3,
  "name": "Dexscreener Trader",
  "version": "2.0.0",
  "description": "Trade Solana tokens via Jupiter aggregator",
  "permissions": ["storage", "activeTab"],
  "host_permissions": [
    "https://*.dexscreener.com/*",
    "https://quote-api.jup.ag/*",
    "https://api.mainnet-beta.solana.com/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon128.png",
      "32": "icons/icon128.png",
      "48": "icons/icon128.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon128.png",
    "32": "icons/icon128.png",
    "48": "icons/icon128.png",
    "128": "icons/icon128.png"
  }
}
```

**Note:** Removed `scripting`, `tabs`, `alarms` permissions (not needed for iOS)

### Step 3: Convert Using Apple's Tool

```bash
# Navigate to project root
cd Dexscreener-trader-extension

# Build the extension first
npm run build

# Copy Safari manifest
cp manifest-safari.json dist/manifest.json

# Run Safari Web Extension Converter
xcrun safari-web-extension-converter dist --app-name "Dexscreener Trader"
```

This creates an Xcode project with:
- `Dexscreener Trader/` - iOS app wrapper
- `Dexscreener Trader Extension/` - Your web extension files
- `Dexscreener Trader.xcodeproj` - Xcode project

### Step 4: Configure Xcode Project

Open the generated `.xcodeproj` file:

```bash
open "Dexscreener Trader.xcodeproj"
```

**In Xcode:**

1. **Select your Team**
   - Click project root in left sidebar
   - Under "Signing & Capabilities"
   - Select your Apple Developer team

2. **Set Bundle Identifier**
   - Change to something unique: `com.yourname.dexscreenertrader`
   - Must match App Store Connect

3. **Configure for iOS**
   - Select "Dexscreener Trader" target
   - Under "Deployment Info"
   - Set minimum iOS version: iOS 15.0+
   - Select device types: iPhone, iPad

4. **App Icons**
   - Add app icons in `Assets.xcassets/AppIcon.appiconset`
   - Need multiple sizes: 20x20, 29x29, 40x40, 58x58, 60x60, 76x76, 80x80, 87x87, 120x120, 152x152, 167x167, 180x180, 1024x1024

### Step 5: Modify for iOS

**Update popup for mobile:**

Create `src/index-mobile.css`:
```css
/* Mobile-specific overrides */
body {
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  font-size: 16px; /* Prevent zoom on input focus */
}

.popup-container {
  width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
}

button {
  min-height: 44px; /* iOS touch target */
  font-size: 16px; /* Prevent zoom */
}

input, textarea {
  font-size: 16px; /* Prevent zoom on focus */
}
```

**Remove unsupported APIs:**

In `src/components/WalletDashboard.jsx`, remove clipboard copy (or use workaround):
```jsx
const copyAddress = () => {
  // iOS doesn't support navigator.clipboard in extensions
  // Show address in alert or use share sheet instead
  alert(`Address: ${wallet.publicKey}`);
  // Or use iOS share sheet (requires native bridge)
};
```

### Step 6: Build and Test

**Build for Simulator:**
```bash
# In Xcode, select iOS Simulator as target
# Press Cmd+R to build and run
```

**The app will:**
1. Install on iOS Simulator
2. Show setup instructions
3. You need to enable the extension in Settings > Safari > Extensions

**Test on Real Device:**
1. Connect iPhone via USB
2. Select device in Xcode
3. Press Cmd+R to build and run
4. Trust developer certificate on device

### Step 7: Enable Extension

On the iOS device:
1. Open **Settings**
2. Scroll to **Safari**
3. Tap **Extensions**
4. Enable **Dexscreener Trader**
5. Tap extension name → **Allow All Websites** (or specific sites)

---

## iOS-Specific Changes Needed

### 1. Remove Background Service Worker

iOS Safari doesn't support persistent background scripts. Remove or modify:

**src/background.js:**
```javascript
// Background scripts on iOS only run when extension is active
// Keep it minimal or remove entirely

console.log('Extension loaded');

// Don't use alarms or persistent connections
```

### 2. Adapt UI for Mobile

**Changes needed:**
- Larger touch targets (min 44x44px)
- No hover states (use :active instead)
- Larger fonts (min 16px to prevent zoom)
- Simplified navigation
- Portrait-first design

**Update `src/components/WalletDashboard.jsx`:**
```jsx
// Add mobile-specific styles
<button
  className="min-h-[44px] touch-manipulation"
  // ... rest of props
>
```

### 3. Handle iOS Storage Limits

iOS has stricter storage quotas. Monitor usage:

```javascript
// Check storage quota
if (navigator.storage && navigator.storage.estimate) {
  const estimate = await navigator.storage.estimate();
  console.log(`Using ${estimate.usage} of ${estimate.quota} bytes`);
}
```

### 4. Add Biometric Authentication (Recommended)

For iOS wallet storage, add Face ID/Touch ID:

**Install dependency:**
```bash
npm install @capacitor/biometric-auth
```

**Add to wallet unlock:**
```javascript
import { BiometricAuth } from '@capacitor/biometric-auth';

async function unlockWithBiometric() {
  try {
    const result = await BiometricAuth.verify({
      reason: 'Unlock your wallet',
      title: 'Authentication Required'
    });

    if (result.verified) {
      // Unlock wallet
    }
  } catch (error) {
    console.error('Biometric auth failed:', error);
  }
}
```

---

## App Store Submission

### Requirements

1. **App Store Connect Account** ($99/year)
2. **App Privacy Policy** (required URL)
3. **App Icons** (all sizes)
4. **Screenshots** (iPhone, iPad)
5. **App Description**
6. **Keywords**
7. **Support URL**

### Privacy Policy

You MUST have a privacy policy. Here's a template:

```markdown
# Privacy Policy for Dexscreener Trader

## Data Collection
- We do NOT collect any personal data
- Wallet keys stored locally on device only
- No analytics or tracking

## Data Storage
- Encrypted wallet stored in device local storage
- Never transmitted to servers
- No cloud backup

## Third-Party Services
- Jupiter API: For price quotes (public data)
- Solana RPC: For blockchain interaction (public)

## Security
- Keys encrypted with user password
- PBKDF2 + NaCl encryption
- No backend servers

## Contact
[Your email]

Last Updated: [Date]
```

### App Store Screenshots

Need screenshots for:
- 6.7" iPhone (1290 x 2796) - iPhone 14 Pro Max
- 6.5" iPhone (1242 x 2688) - iPhone 11 Pro Max
- 5.5" iPhone (1242 x 2208) - iPhone 8 Plus
- 12.9" iPad (2048 x 2732)

Use iOS Simulator to capture:
```bash
# Run in simulator
# Press Cmd+S to save screenshot
```

### App Review Tips

Apple is VERY strict. To pass review:

**DO:**
- ✅ Clearly state it's for small amounts only
- ✅ Add prominent security warnings
- ✅ Require biometric authentication
- ✅ Show how to backup recovery phrase
- ✅ Include demo mode (no real money)
- ✅ Have clear support email
- ✅ Test thoroughly on multiple devices

**DON'T:**
- ❌ Don't mention cryptocurrency in app name (may get rejected)
- ❌ Don't make it look like gambling
- ❌ Don't hide fees or costs
- ❌ Don't auto-execute trades
- ❌ Don't bypass biometric auth

### Submission Process

1. **Create App in App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Click "+" → New App
   - Fill in details

2. **Archive in Xcode**
   - Product → Archive
   - Wait for build to complete
   - Click "Distribute App"
   - Choose "App Store Connect"

3. **Upload Screenshots**
   - In App Store Connect
   - Add screenshots for all device sizes

4. **Fill App Information**
   - Description
   - Keywords
   - Support URL
   - Privacy Policy URL
   - Age Rating (17+ for financial apps)

5. **Submit for Review**
   - Click "Submit for Review"
   - Wait 1-7 days for response
   - Respond to any questions from Apple

---

## Alternative: WalletConnect Integration

**Much Safer Approach for iOS:**

Instead of storing private keys, integrate WalletConnect to use external wallets:

```bash
npm install @walletconnect/web3-provider
```

```javascript
import WalletConnectProvider from '@walletconnect/web3-provider';

// Initialize provider
const provider = new WalletConnectProvider({
  rpc: {
    1: 'https://api.mainnet-beta.solana.com'
  }
});

// Connect to wallet
await provider.enable();

// User's wallet (Phantom, etc.) handles signing
// Much safer than storing keys
```

This way:
- ✅ No private keys in extension
- ✅ Users keep keys in dedicated wallet apps
- ✅ Easier App Store approval
- ✅ Better security
- ✅ Support multiple wallets

---

## Testing Checklist

Before submission:
- [ ] Test on iPhone SE (small screen)
- [ ] Test on iPhone 14 Pro Max (large screen)
- [ ] Test on iPad
- [ ] Test portrait and landscape
- [ ] Test with VoiceOver (accessibility)
- [ ] Test in low bandwidth
- [ ] Test airplane mode handling
- [ ] Verify all permissions are justified
- [ ] Check for crashes
- [ ] Verify biometric auth works
- [ ] Test recovery phrase backup
- [ ] Verify encryption works
- [ ] Test with $0.01 transactions

---

## Costs

- **Apple Developer Account**: $99/year
- **Mac Computer**: Required (Xcode)
- **Time**: 20-40 hours for full conversion
- **App Store Review**: 1-7 days (can be rejected)

---

## Recommended Path Forward

### Phase 1: Desktop Safari First (Easier)
1. Convert for Safari on macOS first
2. Test thoroughly
3. Get familiar with Safari quirks
4. Then move to iOS

### Phase 2: iOS Limited Features
1. View-only mode (no wallet)
2. WalletConnect integration
3. Quote viewing only
4. Submit to App Store

### Phase 3: iOS Full Features (If Needed)
1. Add encrypted wallet
2. Add biometric auth
3. Add extra warnings
4. Resubmit to App Store

---

## Summary

Converting to iOS Safari extension requires:
1. ✅ macOS + Xcode
2. ✅ Manifest modifications
3. ✅ Mobile UI adaptations
4. ✅ Remove unsupported APIs
5. ✅ Add biometric auth
6. ✅ Privacy policy
7. ✅ App Store submission
8. ⚠️ **Consider WalletConnect** instead of key storage

**Estimated Timeline:**
- Simple conversion: 1-2 weeks
- Full testing: 1-2 weeks
- App Store review: 1-7 days
- Total: 3-5 weeks

**My Recommendation:**
Start with WalletConnect integration (no private key storage) for iOS. Much safer and easier to get approved by Apple.

Need help with any specific step?
