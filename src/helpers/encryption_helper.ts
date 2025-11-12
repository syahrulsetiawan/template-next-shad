/**
 * Encryption Helper
 * Simple AES encryption/decryption for sensitive data storage
 */

import CryptoJS from 'crypto-js';

/**
 * Get encryption key from environment variable
 * @returns Encryption key
 */
function getEncryptionKey(): string {
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  if (!key) {
    console.warn(
      'NEXT_PUBLIC_ENCRYPTION_KEY not set, using default key (NOT SECURE!)'
    );
    return 'default-encryption-key-please-change-this';
  }

  return key;
}

/**
 * Encrypt data using AES
 * @param data - Data to encrypt (will be JSON stringified)
 * @returns Encrypted string
 */
export function encrypt(data: any): string {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(
      jsonString,
      getEncryptionKey()
    ).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data encrypted with AES
 * @param encryptedData - Encrypted string
 * @returns Decrypted and parsed data
 */
export function decrypt<T = any>(encryptedData: string): T | null {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, getEncryptionKey());
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!jsonString) {
      console.error('Decryption failed: empty result');
      return null;
    }

    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

/**
 * Encrypt and set item in localStorage
 * @param key - Storage key
 * @param data - Data to store
 */
export function setEncryptedLocalStorage(key: string, data: any): void {
  try {
    const encrypted = encrypt(data);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Failed to set encrypted localStorage:', error);
  }
}

/**
 * Get and decrypt item from localStorage
 * @param key - Storage key
 * @returns Decrypted data or null
 */
export function getEncryptedLocalStorage<T = any>(key: string): T | null {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    return decrypt<T>(encrypted);
  } catch (error) {
    console.error('Failed to get encrypted localStorage:', error);
    return null;
  }
}

/**
 * Remove item from localStorage
 * @param key - Storage key
 */
export function removeEncryptedLocalStorage(key: string): void {
  localStorage.removeItem(key);
}
