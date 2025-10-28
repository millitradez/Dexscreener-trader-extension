// Default token addresses
const DEFAULTS = {
  inputMint: 'So11111111111111111111111111111111111111112', // SOL
  outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  amount: '10000000', // 0.01 SOL
  slippage: '50' // 0.5%
};

// DOM elements
const elements = {
  inputMint: document.getElementById('inputMint'),
  outputMint: document.getElementById('outputMint'),
  amount: document.getElementById('amount'),
  slippage: document.getElementById('slippage'),
  getQuote: document.getElementById('getQuote'),
  openDexscreener: document.getElementById('openDexscreener'),
  loading: document.getElementById('loading'),
  output: document.getElementById('output'),
  outputContent: document.getElementById('outputContent'),
  error: document.getElementById('error'),
  errorContent: document.getElementById('errorContent'),
  healthIndicator: document.getElementById('healthIndicator')
};

// Initialize popup
async function init() {
  // Load saved preferences from chrome.storage
  const saved = await loadPreferences();

  // Set input values
  elements.inputMint.value = saved.inputMint || DEFAULTS.inputMint;
  elements.outputMint.value = saved.outputMint || DEFAULTS.outputMint;
  elements.amount.value = saved.amount || DEFAULTS.amount;
  elements.slippage.value = saved.slippage || DEFAULTS.slippage;

  // Check API health
  checkAPIHealth();

  // Set up event listeners
  elements.getQuote.addEventListener('click', handleGetQuote);
  elements.openDexscreener.addEventListener('click', handleOpenDexscreener);

  // Save preferences when inputs change
  [elements.inputMint, elements.outputMint, elements.amount, elements.slippage].forEach(input => {
    input.addEventListener('change', savePreferences);
  });
}

// Load preferences from chrome.storage
async function loadPreferences() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['inputMint', 'outputMint', 'amount', 'slippage'], (result) => {
      resolve(result);
    });
  });
}

// Save preferences to chrome.storage
async function savePreferences() {
  const preferences = {
    inputMint: elements.inputMint.value,
    outputMint: elements.outputMint.value,
    amount: elements.amount.value,
    slippage: elements.slippage.value
  };

  chrome.storage.local.set(preferences, () => {
    console.log('Preferences saved:', preferences);
  });
}

// Check Jupiter API health
async function checkAPIHealth() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'checkHealth' });

    if (response.success && response.healthy) {
      elements.healthIndicator.className = 'w-3 h-3 rounded-full bg-green-500';
      elements.healthIndicator.title = 'Jupiter API is healthy';
    } else {
      elements.healthIndicator.className = 'w-3 h-3 rounded-full bg-red-500';
      elements.healthIndicator.title = 'Jupiter API is unhealthy';
    }
  } catch (error) {
    elements.healthIndicator.className = 'w-3 h-3 rounded-full bg-yellow-500';
    elements.healthIndicator.title = 'Cannot check API health';
  }
}

// Show loading state
function showLoading() {
  elements.loading.classList.remove('hidden');
  elements.output.classList.add('hidden');
  elements.error.classList.add('hidden');
  elements.getQuote.disabled = true;
  elements.getQuote.textContent = 'Loading...';
}

// Hide loading state
function hideLoading() {
  elements.loading.classList.add('hidden');
  elements.getQuote.disabled = false;
  elements.getQuote.textContent = 'Get Quote';
}

// Show error
function showError(message) {
  hideLoading();
  elements.error.classList.remove('hidden');
  elements.errorContent.textContent = message;
}

// Show output
function showOutput(data) {
  hideLoading();
  elements.output.classList.remove('hidden');
  elements.outputContent.textContent = JSON.stringify(data, null, 2);
}

// Handle get quote button click
async function handleGetQuote() {
  const inputMint = elements.inputMint.value.trim();
  const outputMint = elements.outputMint.value.trim();
  const amount = elements.amount.value.trim();
  const slippage = elements.slippage.value.trim();

  // Validate inputs
  if (!inputMint || !outputMint || !amount) {
    showError('Please fill in all required fields (Input Token, Output Token, Amount)');
    return;
  }

  if (isNaN(amount) || parseInt(amount) <= 0) {
    showError('Amount must be a positive number');
    return;
  }

  if (isNaN(slippage) || parseInt(slippage) < 0) {
    showError('Slippage must be a non-negative number');
    return;
  }

  // Show loading state
  showLoading();

  try {
    // Request quote from background script (which handles retries)
    const response = await chrome.runtime.sendMessage({
      action: 'getQuote',
      inputMint,
      outputMint,
      amount: parseInt(amount),
      slippageBps: parseInt(slippage)
    });

    if (response.success) {
      showOutput(response.data);
    } else {
      showError(response.error || 'Failed to get quote');
    }
  } catch (error) {
    showError(`Error: ${error.message}`);
  }
}

// Handle open Dexscreener button click
async function handleOpenDexscreener() {
  try {
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if already on Dexscreener
    if (tab.url && tab.url.includes('dexscreener.com')) {
      // Already on Dexscreener, just focus it
      chrome.tabs.update(tab.id, { active: true });
    } else {
      // Open Dexscreener in new tab
      chrome.tabs.create({ url: 'https://dexscreener.com/solana' });
    }
  } catch (error) {
    showError(`Failed to open Dexscreener: ${error.message}`);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
