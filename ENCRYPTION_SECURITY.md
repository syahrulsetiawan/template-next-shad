# Encryption Helper - Security Documentation

## Overview

This project uses AES encryption to secure sensitive user data stored in cookies and localStorage.

## What Gets Encrypted

- `X-LANYA-USER` cookie - User profile data
- `user` localStorage - User profile data

## What Doesn't Get Encrypted

- `X-LANYA-AT` - Access token (already JWT, short-lived)
- `X-LANYA-RT` - Refresh token (already JWT, needs to match server)

## Setup

### 1. Generate Encryption Key

You need a secure encryption key. Generate one using:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or use online generator
# https://generate-secret.vercel.app/32
```

### 2. Set Environment Variable

Add to your `.env.local`:

```bash
NEXT_PUBLIC_ENCRYPTION_KEY=your-generated-key-here
```

**⚠️ IMPORTANT:**

- Never commit `.env.local` to git
- Use different keys for dev/staging/production
- Store production key in secure environment variables

## Usage

### Encrypt Data

```typescript
import {encrypt} from '@/helpers/encryption_helper';

const userData = {name: 'John', email: 'john@example.com'};
const encrypted = encrypt(userData);
// Store encrypted string
```

### Decrypt Data

```typescript
import {decrypt} from '@/helpers/encryption_helper';
import {UserData} from '@/types/UserTypes';

const encrypted = 'encrypted-string-here';
const userData = decrypt<UserData>(encrypted);

if (userData) {
  console.log(userData.name); // Access decrypted data
}
```

### LocalStorage Helpers

```typescript
import {
  setEncryptedLocalStorage,
  getEncryptedLocalStorage,
  removeEncryptedLocalStorage
} from '@/helpers/encryption_helper';

// Set encrypted data
setEncryptedLocalStorage('user', userData);

// Get and decrypt
const user = getEncryptedLocalStorage<UserData>('user');

// Remove
removeEncryptedLocalStorage('user');
```

## Where Encryption is Used

### 1. AuthService (`src/services/authService.ts`)

- Login/Register: Encrypts user data before storing in cookies and localStorage
- Uses `encrypt()` for user data

### 2. Middleware (`src/middleware.ts`)

- Encrypts user data when setting cookies after token refresh
- Decrypts user data when reading from cookies
- Uses built-in `encryptData()` and `decryptData()` functions

### 3. useSyncUserFromCookie Hook (`src/hooks/useSyncUserFromCookie.ts`)

- Decrypts user data from cookie set by middleware
- Syncs decrypted data to React context
- Re-encrypts when storing to localStorage

## Security Considerations

### ✅ Good Practices

- User data is encrypted at rest (cookies/localStorage)
- Encryption key is stored in environment variable
- Different keys for different environments
- Automatic encryption/decryption in data flow

### ⚠️ Limitations

- Client-side encryption protects against casual inspection
- Not a replacement for HTTPS/secure transport
- Encryption key is exposed to client (in bundle)
- Primarily prevents casual cookie/localStorage viewing

### 🔒 Production Recommendations

1. Always use HTTPS in production
2. Generate strong random encryption key (32+ characters)
3. Rotate keys periodically
4. Store keys securely (environment variables, secrets manager)
5. Consider backend encryption for highly sensitive data
6. Implement token expiration and refresh strategies

## Testing

Check if encryption is working:

```typescript
// In browser console
const testData = {test: 'hello'};
const encrypted = encrypt(testData);
console.log('Encrypted:', encrypted); // Should be gibberish

const decrypted = decrypt(encrypted);
console.log('Decrypted:', decrypted); // Should be { test: 'hello' }
```

## Troubleshooting

### "NEXT_PUBLIC_ENCRYPTION_KEY not set" warning

- Add the key to `.env.local`
- Restart dev server after adding env variable

### Decryption returns null

- Check if encryption key matches between encrypt/decrypt
- Verify the encrypted string is not corrupted
- Ensure key hasn't changed since encryption

### Data appears as gibberish in cookies/localStorage

- ✅ This is correct! Data should look encrypted
- Use decrypt() function to read it

## Migration from Plain JSON

If you had plain JSON before:

1. Old cookies/localStorage will fail to decrypt (returns null)
2. Users will be logged out automatically
3. On next login, new encrypted data will be stored
4. No manual migration needed - handled automatically
