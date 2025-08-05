import { Pool } from 'pg';

// Database connection configuration
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || 'DATABASE_URL_PLACEHOLDER';

// Create a connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Railway PostgreSQL
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database client with common query methods
export const db = {
  // Execute a query with parameters
  query: async (text: string, params: any[] = []) => {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  },

  // Get a single row
  queryOne: async <T = any>(text: string, params: any[] = []): Promise<T | null> => {
    const result = await db.query(text, params);
    return result.rows[0] || null;
  },

  // Get multiple rows
  queryMany: async <T = any>(text: string, params: any[] = []): Promise<T[]> => {
    const result = await db.query(text, params);
    return result.rows;
  },

  // Execute a transaction
  transaction: async (callback: (client: any) => Promise<any>) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Close the pool (for cleanup)
  close: async () => {
    await pool.end();
  }
};

export default db;