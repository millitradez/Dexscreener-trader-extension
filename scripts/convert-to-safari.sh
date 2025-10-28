#!/bin/bash

# Convert Dexscreener Trader Extension to Safari
# Usage: ./scripts/convert-to-safari.sh

set -e  # Exit on error

echo "🍎 Converting to Safari Extension..."

# Check if on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: This script must be run on macOS with Xcode installed."
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcrun &> /dev/null; then
    echo "❌ Error: Xcode command line tools not found."
    echo "Install with: xcode-select --install"
    exit 1
fi

# Build the extension
echo "📦 Building extension..."
npm run build

# Copy Safari manifest
echo "📝 Copying Safari-compatible manifest..."
cp manifest-safari.json dist/manifest.json

# Create output directory
mkdir -p safari-build

# Run converter
echo "🔄 Running Safari Web Extension Converter..."
xcrun safari-web-extension-converter dist \
    --app-name "Dexscreener Trader" \
    --bundle-identifier "com.dexscreener.trader" \
    --swift \
    --no-open \
    --force

# Move to safari-build directory
mv "Dexscreener Trader" safari-build/

echo ""
echo "✅ Conversion complete!"
echo ""
echo "📂 Xcode project created in: safari-build/Dexscreener Trader/"
echo ""
echo "Next steps:"
echo "1. Open the Xcode project:"
echo "   open safari-build/Dexscreener\\ Trader/Dexscreener\\ Trader.xcodeproj"
echo ""
echo "2. In Xcode:"
echo "   - Select your Apple Developer team"
echo "   - Update bundle identifier if needed"
echo "   - Add app icons to Assets.xcassets"
echo "   - Build and run (Cmd+R)"
echo ""
echo "3. On your iPhone/iPad:"
echo "   - Settings > Safari > Extensions"
echo "   - Enable 'Dexscreener Trader'"
echo ""
echo "⚠️  Note: Review SAFARI_IOS_GUIDE.md for important iOS considerations!"
