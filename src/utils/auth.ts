import { api } from '@/integrations/api/client';

// Secure password verification using API calls to backend

// Function to verify password via backend API
export const verifyPassword = async (inputPassword: string): Promise<boolean> => {
  try {
    const result = await api.post('/auth/verify', { password: inputPassword });
    return result.valid || false;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

// Hash function using Web Crypto API (for client-side hashing if needed)
const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Function to generate the hash (for development/setup purposes)
export const generatePasswordHash = async (password: string): Promise<string> => {
  const salt = 'watch_the_watchers_salt_2024';
  return await hashPassword(password, salt);
};

// Note: updatePasswordHash should be handled server-side only for security