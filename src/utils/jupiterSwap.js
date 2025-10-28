import { Connection, VersionedTransaction, PublicKey } from '@solana/web3.js';
import { getKeypair } from '../wallet/walletManager';

const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6';
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

/**
 * Get swap quote from Jupiter
 */
export async function getSwapQuote({
  inputMint,
  outputMint,
  amount,
  slippageBps = 50
}) {
  try {
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippageBps: slippageBps.toString()
    });

    const response = await fetch(`${JUPITER_QUOTE_API}/quote?${params}`);

    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.statusText}`);
    }

    const quote = await response.json();
    return quote;
  } catch (error) {
    console.error('Failed to get quote:', error);
    throw error;
  }
}

/**
 * Get serialized swap transaction from Jupiter
 */
export async function getSwapTransaction(quote, userPublicKey) {
  try {
    const response = await fetch(`${JUPITER_QUOTE_API}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey: userPublicKey,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: 'auto'
      })
    });

    if (!response.ok) {
      throw new Error(`Jupiter swap API error: ${response.statusText}`);
    }

    const { swapTransaction } = await response.json();
    return swapTransaction;
  } catch (error) {
    console.error('Failed to get swap transaction:', error);
    throw error;
  }
}

/**
 * Execute swap transaction
 */
export async function executeSwap({
  quote,
  wallet,
  onStatusUpdate
}) {
  try {
    onStatusUpdate?.('Getting swap transaction...');

    // Get swap transaction from Jupiter
    const swapTransaction = await getSwapTransaction(quote, wallet.publicKey);

    onStatusUpdate?.('Signing transaction...');

    // Deserialize the transaction
    const transactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(transactionBuf);

    // Sign transaction with wallet
    const keypair = getKeypair(wallet);
    transaction.sign([keypair]);

    onStatusUpdate?.('Sending transaction...');

    // Send transaction to Solana network
    const connection = new Connection(SOLANA_RPC, 'confirmed');
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      maxRetries: 3
    });

    onStatusUpdate?.('Confirming transaction...');

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');

    if (confirmation.value.err) {
      throw new Error('Transaction failed: ' + JSON.stringify(confirmation.value.err));
    }

    return {
      success: true,
      signature,
      explorerUrl: `https://solscan.io/tx/${signature}`
    };

  } catch (error) {
    console.error('Swap execution failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get token balance for a wallet
 */
export async function getTokenBalance(walletPublicKey, tokenMintAddress) {
  try {
    const connection = new Connection(SOLANA_RPC, 'confirmed');

    if (tokenMintAddress === 'So11111111111111111111111111111111111111112') {
      // SOL balance
      const balance = await connection.getBalance(new PublicKey(walletPublicKey));
      return balance; // in lamports
    } else {
      // SPL token balance
      const { value: tokenAccounts } = await connection.getTokenAccountsByOwner(
        new PublicKey(walletPublicKey),
        { mint: new PublicKey(tokenMintAddress) }
      );

      if (tokenAccounts.length === 0) {
        return 0;
      }

      // Get balance from first token account
      const balance = await connection.getTokenAccountBalance(tokenAccounts[0].pubkey);
      return parseInt(balance.value.amount);
    }
  } catch (error) {
    console.error('Failed to get token balance:', error);
    throw error;
  }
}

/**
 * Get SOL balance
 */
export async function getSolBalance(walletPublicKey) {
  try {
    const connection = new Connection(SOLANA_RPC, 'confirmed');
    const balance = await connection.getBalance(new PublicKey(walletPublicKey));
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error('Failed to get SOL balance:', error);
    return 0;
  }
}
