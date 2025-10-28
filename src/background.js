// Background service worker for Dexscreener Trader Extension

console.log('Background service worker initialized');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Dexscreener Trader Extension installed');
});

// Keep service worker alive
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle messages from popup or content scripts if needed
  if (request.action === 'ping') {
    sendResponse({ status: 'ok' });
  }

  return true; // Keep message channel open
});

// Optional: Set up alarm to keep service worker active
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    // Just logging to keep service worker alive
    console.log('Service worker keepalive');
  }
});
