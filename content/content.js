console.log("Dexscreener Trader content script active");

// Extract token pair information from the current page
function extractPairInfo() {
  try {
    // Try to extract from URL first
    const urlMatch = window.location.pathname.match(/\/solana\/([a-zA-Z0-9]+)/);

    if (urlMatch) {
      const pairAddress = urlMatch[1];
      console.log("Detected pair address:", pairAddress);
      return { pairAddress };
    }

    // Try to extract from page metadata or DOM
    const tokenInfo = {
      pairAddress: null,
      baseToken: null,
      quoteToken: null
    };

    // Look for token addresses in the page
    // This is a placeholder - actual implementation would depend on Dexscreener's DOM structure
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(meta => {
      const property = meta.getAttribute('property') || meta.getAttribute('name');
      const content = meta.getAttribute('content');

      if (property && content) {
        if (property.includes('token') || property.includes('pair')) {
          console.log("Found metadata:", property, content);
        }
      }
    });

    return tokenInfo;
  } catch (error) {
    console.error("Error extracting pair info:", error);
    return null;
  }
}

// Create a quick trade button on the Dexscreener page
function createQuickTradeButton() {
  // Check if button already exists
  if (document.getElementById('dex-trader-quick-button')) {
    return;
  }

  const button = document.createElement('div');
  button.id = 'dex-trader-quick-button';
  button.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(59, 130, 246, 0.5)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.4)'">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
      <span>Quick Trade</span>
    </div>
  `;

  button.addEventListener('click', () => {
    const pairInfo = extractPairInfo();
    console.log("Quick Trade clicked, pair info:", pairInfo);

    // Send message to background or popup
    chrome.runtime.sendMessage({
      action: 'openQuickTrade',
      pairInfo
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
      }
    });

    // Also open the extension popup programmatically if possible
    // Note: This typically requires user interaction and may not work in all contexts
    chrome.runtime.sendMessage({ action: 'openPopup' });
  });

  document.body.appendChild(button);
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPairInfo') {
    const pairInfo = extractPairInfo();
    sendResponse({ success: true, pairInfo });
    return true;
  }

  if (request.action === 'injectButton') {
    createQuickTradeButton();
    sendResponse({ success: true });
    return true;
  }
});

// Initialize content script
function init() {
  console.log("Initializing Dexscreener Trader on:", window.location.href);

  // Extract and log pair information
  const pairInfo = extractPairInfo();
  if (pairInfo) {
    console.log("Current pair info:", pairInfo);
  }

  // Create quick trade button after page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createQuickTradeButton);
  } else {
    createQuickTradeButton();
  }

  // Watch for URL changes (SPA navigation)
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.log("URL changed to:", currentUrl);
      const newPairInfo = extractPairInfo();
      if (newPairInfo) {
        console.log("New pair info:", newPairInfo);
      }
    }
  }).observe(document, { subtree: true, childList: true });
}

// Run initialization
init();
