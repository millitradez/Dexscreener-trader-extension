// Import API utilities
importScripts('utils/api.js');

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Dexscreener Trader extension installed.");

  // Test Jupiter API connection
  const isHealthy = await checkJupiterHealth();
  if (isHealthy) {
    console.log("Jupiter API is reachable and healthy");
  } else {
    console.warn("Jupiter API health check failed");
  }
});

// Message listener for API requests from popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getQuote') {
    const { inputMint, outputMint, amount, slippageBps } = request;

    getJupiterQuote(inputMint, outputMint, amount, slippageBps)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({
        success: false,
        error: error.message
      }));

    return true; // Keep channel open for async response
  }

  if (request.action === 'checkHealth') {
    checkJupiterHealth()
      .then(isHealthy => sendResponse({ success: true, healthy: isHealthy }))
      .catch(error => sendResponse({ success: false, error: error.message }));

    return true;
  }
});
