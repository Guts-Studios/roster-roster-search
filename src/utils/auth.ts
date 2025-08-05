import { db } from '@/integrations/database/client';

// Secure password verification using Railway PostgreSQL and hashing

// Hash function using Web Crypto API
const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Function to verify password against stored hash in Railway database
export const verifyPassword = async (inputPassword: string): Promise<boolean> => {
  try {
    // Get the stored hash from Railway database
    const result = await db.queryOne(
      'SELECT value FROM app_config WHERE key = $1',
      ['search_password_hash']
    );

    if (!result) {
      console.error('No password hash found in database');
      return false;
    }

    // Hash the input password with the same salt used in the migration
    const salt = 'watch_the_watchers_salt_2024';
    const inputHash = await hashPassword(inputPassword, salt);
    
    // Compare hashes
    return inputHash === result.value;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

// Function to generate the hash (for development/setup purposes)
export const generatePasswordHash = async (password: string): Promise<string> => {
  const salt = 'watch_the_watchers_salt_2024';
  return await hashPassword(password, salt);
};

// Function to update the password hash in Railway database (admin use only)
export const updatePasswordHash = async (newPassword: string): Promise<boolean> => {
  try {
    const hashedPassword = await generatePasswordHash(newPassword);
    
    await db.query(
      `INSERT INTO app_config (key, value, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (key)
       DO UPDATE SET value = $2, description = $3, updated_at = NOW()`,
      ['search_password_hash', hashedPassword, 'Hashed password for search access']
    );

    return true;
  } catch (error) {
    console.error('Error updating password hash:', error);
    return false;
  }
};