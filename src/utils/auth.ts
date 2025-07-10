import { supabase } from '@/integrations/supabase/client';

// Secure password verification using Supabase and hashing
// The actual password is "WatchtheWatchers2024!"

// Hash function using Web Crypto API
const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Function to verify password against stored hash in Supabase
export const verifyPassword = async (inputPassword: string): Promise<boolean> => {
  try {
    // Get the stored hash from Supabase
    const { data, error } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'search_password_hash')
      .single();

    if (error) {
      console.error('Error fetching password hash:', error);
      // Fallback to client-side verification if Supabase fails
      return inputPassword === 'WatchtheWatchers2024!';
    }

    if (!data) {
      console.error('No password hash found in database');
      return false;
    }

    // Hash the input password with the same salt used in the migration
    const salt = 'watch_the_watchers_salt_2024';
    const inputHash = await hashPassword(inputPassword, salt);
    
    // Compare hashes
    return inputHash === data.value;
  } catch (error) {
    console.error('Error verifying password:', error);
    // Fallback to client-side verification
    return inputPassword === 'WatchtheWatchers2024!';
  }
};

// Function to generate the hash (for development/setup purposes)
export const generatePasswordHash = async (password: string): Promise<string> => {
  const salt = 'watch_the_watchers_salt_2024';
  return await hashPassword(password, salt);
};

// Function to update the password hash in Supabase (admin use only)
export const updatePasswordHash = async (newPassword: string): Promise<boolean> => {
  try {
    const hashedPassword = await generatePasswordHash(newPassword);
    
    const { error } = await supabase
      .from('app_config')
      .upsert({
        key: 'search_password_hash',
        value: hashedPassword,
        description: `Hashed password for search access - ${newPassword}`
      });

    if (error) {
      console.error('Error updating password hash:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating password hash:', error);
    return false;
  }
};