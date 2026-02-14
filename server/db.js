import mysql from 'mysql2/promise'

const host = process.env.MYSQL_HOST || process.env.MYSQLHOST || 'localhost'
const useSsl = process.env.MYSQL_SSL === 'true' || host.includes('psdb.cloud')

const pool = mysql.createPool({
  host,
  port: parseInt(process.env.MYSQL_PORT || process.env.MYSQLPORT || '3306', 10),
  user: process.env.MYSQL_USER || process.env.MYSQLUSER || 'root',
  password: process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || 'souvenirs_a_deux',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  ...(useSsl && { ssl: { rejectUnauthorized: true } }),
})

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params)
  return rows[0] ?? null
}

export { pool }
