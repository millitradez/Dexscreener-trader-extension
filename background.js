chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Dexscreener Trader extension installed.");
});

async function testJupiterAPI() {
  const url =
    "https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=Es9vMFrzaCERmJFrLbhV4RxB3s7fFzYhw9o7PQ1q6i9L&amount=10000000";
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    console.log("✅ Jupiter API reachable:", data);
  } catch (err) {
    console.error("⚠️ Jupiter API connection failed:", err.message);
  }
}

testJupiterAPI();