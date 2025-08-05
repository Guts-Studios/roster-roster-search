// API client for backend communication
const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';

export const api = {
  // Execute a query equivalent - now makes API calls
  query: async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Get a single row equivalent
  queryOne: async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T | null> => {
    const result = await api.query(endpoint, options);
    return result || null;
  },

  // Get multiple rows equivalent
  queryMany: async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T[]> => {
    const result = await api.query(endpoint, options);
    return Array.isArray(result) ? result : [];
  },

  // POST request helper
  post: async (endpoint: string, data: any) => {
    return api.query(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default api;