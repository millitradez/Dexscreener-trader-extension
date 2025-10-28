/**
 * Fetch with retry logic and timeout handling
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(url, options = {}, maxRetries = 3, timeout = 10000) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // If response is not ok, throw error to trigger retry
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error;

      // Don't retry on abort (timeout) for the last attempt
      if (attempt < maxRetries) {
        // Exponential backoff: 2^attempt * 1000ms (1s, 2s, 4s)
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(
          `⚠️ Attempt ${attempt + 1}/${maxRetries + 1} failed for ${url}. ` +
          `Retrying in ${delay}ms... Error: ${error.message}`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries exhausted
  throw new Error(
    `Failed after ${maxRetries + 1} attempts: ${lastError.message}`
  );
}

/**
 * Fetch Jupiter quote with retry logic
 * @param {string} inputMint - Input token mint address
 * @param {string} outputMint - Output token mint address
 * @param {number} amount - Amount in smallest unit
 * @param {number} slippageBps - Slippage in basis points (default: 50 = 0.5%)
 * @returns {Promise<object>} Jupiter quote data
 */
async function getJupiterQuote(
  inputMint,
  outputMint,
  amount,
  slippageBps = 50
) {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amount.toString(),
    slippageBps: slippageBps.toString()
  });

  const url = `https://quote-api.jup.ag/v6/quote?${params}`;

  try {
    const response = await fetchWithRetry(url, {}, 3, 10000);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('❌ Jupiter API error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check Jupiter API health
 * @returns {Promise<boolean>}
 */
async function checkJupiterHealth() {
  try {
    // Simple SOL to USDC quote to test connectivity
    const result = await getJupiterQuote(
      'So11111111111111111111111111111111111111112', // SOL
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      1000000 // 0.001 SOL
    );
    return result.success;
  } catch (error) {
    return false;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchWithRetry, getJupiterQuote, checkJupiterHealth };
}
