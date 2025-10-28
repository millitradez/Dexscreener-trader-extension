# Safari iOS Troubleshooting

## "I don't see my extension in iPhone Settings"

This is the #1 issue! Here's why and how to fix it:

### ❌ What Doesn't Work

Simply building the extension is **NOT enough** for iOS:
```bash
npm run build  # This only creates the Chrome/Edge version
```

The built extension in the `dist/` folder **cannot be directly loaded on iOS** like you can on Chrome desktop.

---

## ✅ What You Need to Do

### Step 1: Verify You Have macOS
Safari iOS extensions **must be wrapped in an iOS app**, which requires:
- ✅ macOS computer (Mac, MacBook, iMac, Mac Mini)
- ✅ Xcode installed (from Mac App Store)
- ✅ Physical iPhone/iPad OR iOS Simulator

**If you don't have a Mac, you cannot create iOS Safari extensions.** There's no workaround.

---

### Step 2: Build the iOS App Wrapper

On your **Mac**, follow these steps:

```bash
# 1. Build the extension
npm run build:safari

# 2. Run the conversion script (macOS only!)
./scripts/convert-to-safari.sh
```

This creates an **Xcode project** with an iOS app that contains your extension.

---

### Step 3: Open in Xcode

```bash
# Open the generated Xcode project
open safari-build/Dexscreener\ Trader/Dexscreener\ Trader.xcodeproj
```

Or manually:
1. Navigate to `safari-build/Dexscreener Trader/`
2. Double-click `Dexscreener Trader.xcodeproj`

---

### Step 4: Configure Xcode Project

In Xcode, you must configure the project before building:

#### A. Select Your Team
1. Click on the project name in the left sidebar (top level)
2. Select the "Dexscreener Trader" target
3. Go to "Signing & Capabilities" tab
4. Under "Team", select your Apple Developer account
   - If you don't see any teams, you need to add your Apple ID:
     - Xcode → Preferences → Accounts
     - Click "+" to add Apple ID
     - Sign in with your Apple ID

#### B. Fix Bundle Identifier Conflicts
If you see a red error about bundle identifier:
1. Change the bundle identifier to something unique
2. Example: `com.yourname.dexscreenertrader`
3. Do this for BOTH targets:
   - "Dexscreener Trader" (the app)
   - "Dexscreener Trader Extension" (the extension)

#### C. Select Your Device
In the top bar near the play button:
1. Click the device selector
2. Choose:
   - Your physical iPhone (if connected via USB)
   - OR "iPhone 14 Pro" (or any Simulator)

---

### Step 5: Build and Install

#### Option A: Physical iPhone (Recommended)
1. Connect iPhone to Mac via USB
2. Unlock iPhone
3. Trust the computer if prompted
4. In Xcode, select your iPhone from device list
5. Click the **Play button** (▶️) or press **Cmd+R**
6. Xcode will:
   - Build the app
   - Install it on your iPhone
   - Launch the app

#### Option B: iOS Simulator
1. In Xcode, select a simulator (e.g., "iPhone 14 Pro")
2. Click the **Play button** (▶️) or press **Cmd+R**
3. Simulator will launch with the app installed

---

### Step 6: Enable Extension on iPhone

After the app is installed:

**On Physical iPhone:**
1. Open **Settings** app
2. Scroll down to **Safari**
3. Tap **Extensions**
4. You should now see **"Dexscreener Trader"**
5. Toggle it **ON**
6. Tap the extension name
7. Tap **"Allow All Websites"** or choose specific sites

**On Simulator:**
Same steps as above.

---

## 🔍 Still Not Showing?

### Check 1: App Must Be Installed
The extension **only appears** after the iOS app is installed. Check:
- Home screen: Do you see the "Dexscreener Trader" app icon?
- If NO → The app didn't install successfully

### Check 2: Extension Target Enabled
In Xcode:
1. Click project name in sidebar
2. Look for TWO targets:
   - ✅ "Dexscreener Trader" (app)
   - ✅ "Dexscreener Trader Extension" (extension)
3. Both should have checkmarks when you build

### Check 3: Manifest Issues
Check the Safari manifest:
```bash
cat dist/manifest.json
```

Must have:
```json
{
  "manifest_version": 3,
  "action": {
    "default_popup": "popup.html"
  }
}
```

### Check 4: Build Errors
Check Xcode's error panel (bottom):
- Red errors? Fix them first
- Yellow warnings? Usually okay

### Check 5: Trust Developer Certificate
On physical iPhone:
1. Settings → General → VPN & Device Management
2. Find your developer certificate
3. Tap → Trust

---

## 🎯 The Complete Flow

Here's what the **complete process** looks like:

```
1. You (on Mac):
   ├─ npm run build:safari
   ├─ ./scripts/convert-to-safari.sh
   └─ Opens Xcode project

2. Xcode (on Mac):
   ├─ Configure signing & team
   ├─ Select iPhone device
   ├─ Press Cmd+R to build
   └─ Installs app on iPhone

3. iPhone (Settings):
   ├─ See "Dexscreener Trader" app installed
   ├─ Settings → Safari → Extensions
   ├─ See "Dexscreener Trader" extension
   └─ Enable it

4. Safari (on iPhone):
   ├─ Extension is now active
   └─ Can use the extension
```

---

## 🚫 Common Mistakes

### Mistake 1: Trying to Load Without Xcode
❌ **Won't work:**
```bash
npm run build
# Try to load dist/ folder on iPhone somehow
```

✅ **Must do:**
```bash
npm run build:safari
./scripts/convert-to-safari.sh
# Open Xcode → Build → Install on iPhone
```

### Mistake 2: Thinking It's Like Chrome
Chrome/Edge: Just load the extension folder
Safari iOS: Must wrap in iOS app via Xcode

### Mistake 3: Not Having Developer Certificate
You need:
- Free Apple ID (for testing on your own device)
- OR paid Apple Developer Account ($99/year) for App Store

### Mistake 4: Looking for Extension Without Installing App
Extension **only appears** after the container app is installed

---

## 🔧 Quick Debug Checklist

Run through this checklist:

- [ ] I have a Mac computer
- [ ] Xcode is installed and opened
- [ ] I ran `./scripts/convert-to-safari.sh`
- [ ] Xcode project opened successfully
- [ ] I selected my Apple ID team in Xcode
- [ ] Bundle identifier is unique (no conflicts)
- [ ] I selected my iPhone (or Simulator) as device
- [ ] I pressed Cmd+R and build succeeded (no red errors)
- [ ] The app installed on my iPhone (I can see the icon)
- [ ] I went to Settings → Safari → Extensions
- [ ] The extension now appears in the list

If all checked: Extension should be there! ✅

If still not working: Check Xcode console for error messages.

---

## 📱 What You Should See

### After Building in Xcode:
**iPhone Home Screen:**
```
┌─────────────────┐
│                 │
│   📱 [Icon]     │
│                 │
│ Dexscreener     │
│   Trader        │
└─────────────────┘
```

### In Settings:
```
Settings
  └─ Safari
      └─ Extensions
          └─ Dexscreener Trader  [Toggle ON]
              ├─ Allow on All Websites
              └─ Allow on Specific Websites
```

### In Safari:
When you tap the AA button in Safari:
```
AA Menu
  └─ Dexscreener Trader
      └─ [Your extension popup appears]
```

---

## 🆘 Still Stuck?

### Check Xcode Console
In Xcode, open:
- View → Debug Area → Activate Console
- Look for error messages

### Common Error Messages

**"Failed to verify code signature"**
→ Solution: Settings → General → Device Management → Trust developer

**"No signing certificate found"**
→ Solution: Xcode → Preferences → Accounts → Add Apple ID

**"Bundle identifier already in use"**
→ Solution: Change bundle ID to something unique

**"This app cannot be installed"**
→ Solution: Free Apple ID can only install 3 apps. Delete an old one.

---

## 💡 Alternative: Use TestFlight

If direct installation keeps failing:

1. **Archive the app** in Xcode:
   - Product → Archive
   - Wait for build

2. **Upload to App Store Connect**:
   - Distribute → TestFlight
   - Upload build

3. **Install via TestFlight**:
   - Download TestFlight app on iPhone
   - Install your app from there
   - More reliable for testing

---

## 🎓 Learning Resources

- [Apple's Safari Extension Guide](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
- [Xcode Tutorial](https://developer.apple.com/tutorials/app-dev-training/)
- [Safari Web Extensions](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari)

---

## 📞 Need More Help?

If you're still stuck, provide:
1. What operating system you're on (macOS? Windows? Linux?)
2. Did you run `./scripts/convert-to-safari.sh`?
3. Do you see the app icon on your iPhone home screen?
4. Any error messages from Xcode?

This will help diagnose the issue!
