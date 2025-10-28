import nacl from 'tweetnacl';

/**
 * Derive a 32-byte key from a password using PBKDF2
 */
async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // Derive 32 bytes using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256 // 32 bytes * 8 bits
  );

  return new Uint8Array(derivedBits);
}

/**
 * Encrypt data with password
 * @param {string} data - Data to encrypt
 * @param {string} password - Password for encryption
 * @returns {Promise<string>} Base64 encoded encrypted data
 */
export async function encrypt(data, password) {
  try {
    // Generate random salt and nonce
    const salt = nacl.randomBytes(16);
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);

    // Derive encryption key from password
    const key = await deriveKey(password, salt);

    // Encrypt the data
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const encrypted = nacl.secretbox(dataBytes, nonce, key);

    // Combine salt + nonce + encrypted data
    const combined = new Uint8Array(salt.length + nonce.length + encrypted.length);
    combined.set(salt);
    combined.set(nonce, salt.length);
    combined.set(encrypted, salt.length + nonce.length);

    // Return as base64
    return btoa(String.fromCharCode.apply(null, combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data with password
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @param {string} password - Password for decryption
 * @returns {Promise<string>} Decrypted data
 */
export async function decrypt(encryptedData, password) {
  try {
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(c => c.charCodeAt(0))
    );

    // Extract salt, nonce, and encrypted data
    const salt = combined.slice(0, 16);
    const nonce = combined.slice(16, 16 + nacl.secretbox.nonceLength);
    const encrypted = combined.slice(16 + nacl.secretbox.nonceLength);

    // Derive decryption key from password
    const key = await deriveKey(password, salt);

    // Decrypt the data
    const decrypted = nacl.secretbox.open(encrypted, nonce, key);

    if (!decrypted) {
      throw new Error('Decryption failed - incorrect password or corrupted data');
    }

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data - incorrect password?');
  }
}

/**
 * Hash password for verification (without storing the actual password)
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, new Uint8Array(hash)));
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password, hash) {
  const computed = await hashPassword(password);
  return computed === hash;
}
