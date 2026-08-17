import mysql from 'mysql2/promise';

// Lazy initialized MySQL Connection Pool
let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'marketplace_teachers';

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 15,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

export async function testDbConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    if (!process.env.DB_HOST && !process.env.DB_NAME) {
      return {
        connected: false,
        message: 'Database environment variables (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD) not configured. Using high-availability in-memory/fallback mode.',
      };
    }
    const db = getDbPool();
    const [rows] = await db.query('SELECT 1 as val');
    return { connected: true, message: 'MySQL/MariaDB connection pool active and healthy.' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Failed to connect to MySQL database.' };
  }
}
