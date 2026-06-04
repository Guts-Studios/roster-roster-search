import { api } from '@/integrations/api/client';

// Password verification via the server API. The server holds the salt + hash
// comparison; clients never see either. Do NOT add client-side hashing helpers
// here — they would bake the salt into the public bundle.
export const verifyPassword = async (inputPassword: string): Promise<boolean> => {
  try {
    const result = await api.post('/auth/verify', { password: inputPassword });
    return result.valid || false;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};
