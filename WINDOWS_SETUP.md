# Windows Setup Guide - Dexscreener Trader Extension

Complete guide for installing the extension on Windows with Chrome or Edge.

## ⚠️ Important Note

**Safari iOS is NOT available without a Mac.** This guide is for:
- ✅ Chrome on Windows
- ✅ Edge on Windows
- ✅ Any Chromium browser on Windows

---

## Prerequisites

### Required Software
1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Choose "LTS" version
   - Install with default settings

2. **Git** (optional, for cloning)
   - Download: https://git-scm.com/download/win
   - Or download ZIP from GitHub

3. **Chrome or Edge Browser**
   - Chrome: https://www.google.com/chrome/
   - Edge: Already installed on Windows 10/11

### Check Node.js Installation
Open **Command Prompt** or **PowerShell**:
```bash
node --version
# Should show: v16.x.x or higher

npm --version
# Should show: 8.x.x or higher
```

---

## Step-by-Step Installation

### Step 1: Download the Extension

**Option A: Using Git**
```bash
# Open Command Prompt or PowerShell
cd C:\Users\YourUsername\Documents
git clone https://github.com/millitradez/Dexscreener-trader-extension.git
cd Dexscreener-trader-extension
```

**Option B: Download ZIP**
1. Go to: https://github.com/millitradez/Dexscreener-trader-extension
2. Click green "Code" button
3. Click "Download ZIP"
4. Extract to: `C:\Users\YourUsername\Documents\Dexscreener-trader-extension`

---

### Step 2: Install Dependencies

Open **Command Prompt** or **PowerShell** in the extension folder:

```bash
# Navigate to extension folder
cd C:\Users\YourUsername\Documents\Dexscreener-trader-extension

# Install dependencies (takes 1-2 minutes)
npm install
```

You should see:
```
added 259 packages in 45s
```

---

### Step 3: Build the Extension

```bash
# Build for Chrome/Edge
npm run build
```

You should see:
```
vite v5.4.21 building for production...
✓ built in 3.27s
```

This creates a `dist` folder with the built extension.

---

### Step 4: Load Extension in Chrome

#### A. Open Chrome Extensions Page
1. Open **Chrome**
2. Click the **three dots** (⋮) in top-right
3. Go to: **Extensions** → **Manage Extensions**
4. OR type in address bar: `chrome://extensions/`

#### B. Enable Developer Mode
1. Look for **"Developer mode"** toggle in top-right
2. Click to **turn it ON** (should turn blue)

#### C. Load the Extension
1. Click **"Load unpacked"** button (top-left)
2. Navigate to: `C:\Users\YourUsername\Documents\Dexscreener-trader-extension\dist`
3. Select the **`dist`** folder (NOT the root folder!)
4. Click **"Select Folder"**

#### D. Verify Installation
You should see:
```
┌─────────────────────────────────┐
│ Dexscreener Trader              │
│ v2.0.0                          │
│ [Icon]                          │
│ Trade Solana tokens...          │
│ [Details] [Remove] [Errors]     │
└─────────────────────────────────┘
```

---

### Step 5: Load Extension in Edge

#### A. Open Edge Extensions Page
1. Open **Microsoft Edge**
2. Click the **three dots** (...) in top-right
3. Go to: **Extensions** → **Manage Extensions**
4. OR type in address bar: `edge://extensions/`

#### B. Enable Developer Mode
1. Look for **"Developer mode"** toggle (bottom-left)
2. Click to **turn it ON**

#### C. Load the Extension
1. Click **"Load unpacked"** button
2. Navigate to: `C:\Users\YourUsername\Documents\Dexscreener-trader-extension\dist`
3. Select the **`dist`** folder
4. Click **"Select Folder"**

---

### Step 6: Pin the Extension

To easily access the extension:

1. Click the **puzzle piece icon** (🧩) in browser toolbar
2. Find **"Dexscreener Trader"**
3. Click the **pin icon** (📌) next to it
4. Extension icon now appears in toolbar

---

## Using the Extension

### First Time Setup

1. **Click the extension icon** in toolbar
2. You'll see the setup screen
3. **Choose an option:**
   - **Create New Wallet** → Generates new 12-word phrase
   - **Import Phrase** → Restore from existing mnemonic
   - **Import Key** → Import from Base58 private key

4. **Set a strong password** (minimum 8 characters)
   - Use letters, numbers, symbols
   - Don't forget this password!

5. **IMPORTANT: Write down your recovery phrase!**
   - The 12 words shown on screen
   - Write on paper (NOT digital)
   - Store in safe place
   - Anyone with these words can access your funds

---

### Making Your First Trade

#### Step 1: Fund Your Wallet
1. Click extension icon → Unlock wallet
2. Copy your wallet address (click copy icon)
3. Send SOL from another wallet or exchange
4. Balance updates automatically

#### Step 2: Execute a Swap
1. Click **"Swap"** button
2. **Select tokens:**
   - Input: What you're selling (e.g., SOL)
   - Output: What you're buying (e.g., USDC)
3. **Enter amount** in smallest units:
   - 1 SOL = 1,000,000,000 (9 decimals)
   - 1 USDC = 1,000,000 (6 decimals)
4. **Review quote:**
   - Exchange rate
   - Price impact
   - Slippage tolerance
5. **Click "Swap Tokens"**
6. Wait for confirmation (~5-30 seconds)
7. Click link to view on Solscan

---

## Common Issues & Solutions

### Issue 1: "npm is not recognized"
**Problem:** Node.js not installed or not in PATH

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart Command Prompt
3. Try again

---

### Issue 2: "Error: Cannot find module"
**Problem:** Dependencies not installed

**Solution:**
```bash
cd Dexscreener-trader-extension
npm install
```

---

### Issue 3: Extension Shows Errors
**Problem:** Loaded wrong folder

**Solution:**
1. Remove extension from Chrome
2. Make sure you load the **`dist`** folder, not root
3. Check path: `.../Dexscreener-trader-extension/dist`

---

### Issue 4: "Build failed"
**Problem:** Node.js version too old

**Solution:**
1. Check version: `node --version`
2. If below v16, update Node.js
3. Delete `node_modules` folder
4. Run `npm install` again
5. Run `npm run build` again

---

### Issue 5: "Manifest errors"
**Problem:** Wrong manifest loaded

**Solution:**
```bash
# Make sure you built for Chrome, not Safari
npm run build

# NOT: npm run build:safari (that's for Mac only)
```

---

### Issue 6: Extension Icon Missing
**Problem:** Icons not built properly

**Solution:**
```bash
# Rebuild from scratch
rm -rf dist node_modules
npm install
npm run build
```

---

### Issue 7: Wallet Won't Unlock
**Problem:** Wrong password or corrupted storage

**Solution:**
1. Make sure Caps Lock is OFF
2. Try typing password in notepad first
3. If forgot password: Must restore from recovery phrase
4. Settings → Import Phrase → Enter 12 words

---

### Issue 8: Transaction Failed
**Possible causes:**
- ❌ Not enough SOL for fees (~0.001 SOL needed)
- ❌ Slippage too low (price moved)
- ❌ Token has low liquidity
- ❌ Network congestion

**Solution:**
- Increase slippage to 1% or 3%
- Try smaller amount
- Wait a few minutes and retry
- Make sure you have SOL for fees

---

## Updating the Extension

When new version is released:

### Option A: Git Pull
```bash
cd Dexscreener-trader-extension
git pull origin main
npm install
npm run build
# Reload extension in Chrome
```

### Option B: Fresh Download
1. Download new ZIP from GitHub
2. Extract to new folder
3. Run `npm install` and `npm run build`
4. In Chrome, remove old version
5. Load new `dist` folder

---

## Security Best Practices

### DO ✅
- Use strong, unique password
- Write recovery phrase on paper
- Store recovery phrase in safe place
- Test with small amounts first
- Double-check addresses before swapping
- Lock wallet when not in use

### DON'T ❌
- Share recovery phrase with anyone
- Store recovery phrase digitally
- Use for large amounts (use hardware wallet)
- Forget your password (can't recover without phrase)
- Trust anyone asking for your keys

---

## Uninstalling

To remove the extension:

1. **In Chrome:**
   - Go to `chrome://extensions/`
   - Find "Dexscreener Trader"
   - Click "Remove"
   - Confirm

2. **Delete wallet data:**
   - Extension stores encrypted data in browser
   - Removing extension deletes stored wallet
   - **Make sure you have your recovery phrase first!**

---

## File Locations

```
C:\Users\YourUsername\Documents\Dexscreener-trader-extension\
├── dist\                  ← Load THIS folder in Chrome
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   ├── manifest.json
│   └── icons\
├── src\                   ← Source code
├── package.json
└── README.md
```

---

## Command Reference

```bash
# Install dependencies
npm install

# Build for Chrome/Edge (Windows/Mac/Linux)
npm run build

# Build for Safari (Mac only - DON'T use on Windows)
npm run build:safari

# Development mode (with hot reload)
npm run dev

# Preview build
npm run preview
```

---

## Keyboard Shortcuts

In the extension:
- **Tab** - Navigate between fields
- **Enter** - Submit forms
- **Esc** - Close popup
- **Ctrl+C** - Copy (when text selected)

---

## Getting Help

### Check Logs
1. Right-click extension icon
2. Click "Inspect popup"
3. Check Console tab for errors

### Common Error Messages

**"Failed to load extension"**
→ Make sure you loaded the `dist` folder

**"Manifest version mismatch"**
→ Rebuild with `npm run build`

**"Storage quota exceeded"**
→ Clear browser data or use new profile

**"Network error"**
→ Check internet connection

---

## Windows-Specific Tips

### PowerShell Execution Policy
If you get "cannot be loaded because running scripts is disabled":

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Path Spaces
If path has spaces, use quotes:
```bash
cd "C:\Users\Your Name\Documents\Dexscreener-trader-extension"
```

### Antivirus Blocking
If antivirus blocks npm install:
- Temporarily disable antivirus
- Or add folder to exclusions
- Or use Windows Defender only

---

## Testing Checklist

Before using with real funds:

- [ ] Extension loads without errors
- [ ] Can create new wallet
- [ ] Can see 12-word recovery phrase
- [ ] Can lock and unlock wallet
- [ ] Balance shows correctly
- [ ] Can get quotes for swaps
- [ ] Test with 0.001 SOL first
- [ ] Transaction completes successfully
- [ ] Can view transaction on Solscan

---

## Need More Help?

1. **Check the main README.md** for detailed features
2. **Open GitHub Issues**: https://github.com/millitradez/Dexscreener-trader-extension/issues
3. **Provide details when asking:**
   - Windows version
   - Chrome/Edge version
   - Error messages
   - What step failed

---

## Summary

**To install on Windows:**
```bash
1. Install Node.js from nodejs.org
2. git clone [repo] OR download ZIP
3. cd Dexscreener-trader-extension
4. npm install
5. npm run build
6. Load dist/ folder in Chrome/Edge
```

**That's it!** Extension now works on Windows.

Remember: Safari iOS requires a Mac. If you want mobile access, use the browser on your phone and visit supported websites.

---

**Version:** 2.0.0
**Platform:** Windows 10/11
**Browser:** Chrome, Edge, Brave, Opera (any Chromium browser)
