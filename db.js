import 'dotenv/config'
import mysql from 'mysql2/promise'

// Create a reusable MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nfc',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  charset: 'utf8mb4',
  supportBigNumbers: true,
  dateStrings: true
})

export const getPool = () => pool

export async function initDb() {
  const conn = await pool.getConnection()
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NULL,
        email VARCHAR(255) NULL,
        phone VARCHAR(64) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ip VARCHAR(45) NULL,
        raw JSON NOT NULL,
        PRIMARY KEY (id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)
  } finally {
    conn.release()
  }
}

export async function insertOrder(orderPayload) {
  const conn = await pool.getConnection()
  try {
    const name = typeof orderPayload.name === 'string' ? orderPayload.name : null
    const email = typeof orderPayload.email === 'string' ? orderPayload.email : null
    const phone = typeof orderPayload.phone === 'string' ? orderPayload.phone : null
    const ip = typeof orderPayload.ip === 'string' ? orderPayload.ip : null
    const [result] = await conn.query(
      'INSERT INTO orders (name, email, phone, ip, raw) VALUES (?, ?, ?, ?, CAST(? AS JSON))',
      [name, email, phone, ip, JSON.stringify(orderPayload)]
    )
    return result.insertId
  } finally {
    conn.release()
  }
}

export async function healthCheck() {
  const conn = await pool.getConnection()
  try {
    await conn.query('SELECT 1')
    return true
  } finally {
    conn.release()
  }
}


