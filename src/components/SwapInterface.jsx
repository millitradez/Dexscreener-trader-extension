import React, { useState, useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';
import { getSwapQuote, executeSwap } from '../utils/jupiterSwap';

const COMMON_TOKENS = [
  { symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112', decimals: 9 },
  { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
  { symbol: 'USDT', mint: 'Es9vMFrzaCERmJFrLbhV4RxB3s7fFzYhw9o7PQ1q6i9L', decimals: 6 },
];

export default function SwapInterface({ onBack }) {
  const { wallet, updateBalance } = useWalletStore();

  const [inputToken, setInputToken] = useState(COMMON_TOKENS[0]);
  const [outputToken, setOutputToken] = useState(COMMON_TOKENS[1]);
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [slippage, setSlippage] = useState(50); // 0.5%

  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [txSignature, setTxSignature] = useState('');

  // Get quote when inputs change
  useEffect(() => {
    const getQuote = async () => {
      if (!inputAmount || parseFloat(inputAmount) <= 0) {
        setQuote(null);
        setOutputAmount('');
        return;
      }

      setLoadingQuote(true);
      setError('');

      try {
        const amountInSmallestUnit = Math.floor(
          parseFloat(inputAmount) * Math.pow(10, inputToken.decimals)
        );

        const quoteData = await getSwapQuote({
          inputMint: inputToken.mint,
          outputMint: outputToken.mint,
          amount: amountInSmallestUnit,
          slippageBps: slippage
        });

        setQuote(quoteData);

        // Calculate output amount
        const outAmount = parseInt(quoteData.outAmount) / Math.pow(10, outputToken.decimals);
        setOutputAmount(outAmount.toFixed(6));

      } catch (err) {
        console.error('Quote error:', err);
        setError('Failed to get quote. Please try again.');
        setQuote(null);
        setOutputAmount('');
      } finally {
        setLoadingQuote(false);
      }
    };

    // Debounce quote requests
    const timer = setTimeout(getQuote, 500);
    return () => clearTimeout(timer);
  }, [inputAmount, inputToken, outputToken, slippage]);

  const handleSwap = async () => {
    if (!quote) {
      setError('Please get a quote first');
      return;
    }

    setExecuting(true);
    setError('');
    setTxSignature('');

    try {
      const result = await executeSwap({
        quote,
        wallet,
        onStatusUpdate: (msg) => setStatus(msg)
      });

      if (result.success) {
        setTxSignature(result.signature);
        setStatus('Swap successful!');
        setInputAmount('');
        setOutputAmount('');
        setQuote(null);

        // Update balance
        setTimeout(() => updateBalance(), 2000);
      } else {
        setError(result.error || 'Swap failed');
        setStatus('');
      }
    } catch (err) {
      setError(err.message || 'Swap execution failed');
      setStatus('');
    } finally {
      setExecuting(false);
    }
  };

  const switchTokens = () => {
    setInputToken(outputToken);
    setOutputToken(inputToken);
    setInputAmount('');
    setOutputAmount('');
    setQuote(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-slate-700">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-white">Swap Tokens</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Input Token */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-slate-400">You Pay</label>
            <select
              value={inputToken.symbol}
              onChange={(e) => {
                const token = COMMON_TOKENS.find(t => t.symbol === e.target.value);
                if (token) setInputToken(token);
              }}
              className="bg-slate-700 text-white text-sm font-medium px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {COMMON_TOKENS.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.00"
            step="any"
            className="w-full bg-transparent text-white text-2xl font-bold focus:outline-none"
          />
        </div>

        {/* Switch Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={switchTokens}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* Output Token */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-slate-400">You Receive</label>
            <select
              value={outputToken.symbol}
              onChange={(e) => {
                const token = COMMON_TOKENS.find(t => t.symbol === e.target.value);
                if (token) setOutputToken(token);
              }}
              className="bg-slate-700 text-white text-sm font-medium px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {COMMON_TOKENS.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full text-white text-2xl font-bold">
            {loadingQuote ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-base text-slate-400">Getting quote...</span>
              </div>
            ) : (
              outputAmount || '0.00'
            )}
          </div>
        </div>

        {/* Slippage Setting */}
        <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg p-3">
          <span className="text-sm text-slate-400">Slippage Tolerance</span>
          <div className="flex items-center space-x-2">
            {[50, 100, 300].map(bps => (
              <button
                key={bps}
                onClick={() => setSlippage(bps)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  slippage === bps
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {bps / 100}%
              </button>
            ))}
          </div>
        </div>

        {/* Quote Info */}
        {quote && !loadingQuote && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Rate</span>
              <span className="text-white font-medium">
                1 {inputToken.symbol} ≈ {(parseFloat(outputAmount) / parseFloat(inputAmount)).toFixed(6)} {outputToken.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Price Impact</span>
              <span className="text-white font-medium">
                {quote.priceImpactPct ? `${quote.priceImpactPct}%` : '< 0.01%'}
              </span>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {status && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
            <p className="text-sm text-blue-300">{status}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {txSignature && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
            <p className="text-sm text-green-300 mb-2">Transaction successful!</p>
            <a
              href={`https://solscan.io/tx/${txSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-400 hover:text-green-300 underline break-all"
            >
              View on Solscan →
            </a>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={executing || !quote || loadingQuote}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-4 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          {executing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Swapping...</span>
            </>
          ) : (
            <span>Swap Tokens</span>
          )}
        </button>

        <p className="text-xs text-slate-500 text-center">
          Powered by Jupiter Aggregator
        </p>
      </div>
    </div>
  );
}
