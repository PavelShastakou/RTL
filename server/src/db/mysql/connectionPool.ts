import mysql, { PoolConfig } from 'mysql';

const DATABASE_HOST = process.env["DATABASE_HOST"]
const DATABASE_PORT = +process.env["DATABASE_PORT"]
const DATABASE_USER = process.env["DATABASE_USER"]
const DATABASE_PASSWORD = process.env["DATABASE_PASSWORD"]
const DATABASE_DATABASE_NAME = process.env["DATABASE_DATABASE_NAME"]
const DATABASE_CONNECTION_LIMIT = +process.env["DATABASE_CONNECTION_LIMIT"]

const config: PoolConfig = {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_DATABASE_NAME,
    connectionLimit: DATABASE_CONNECTION_LIMIT,
};
console.log(config)
const pool = mysql.createPool(config);


/**
 * Test connection
 */
pool.getConnection((err, connection) => {

  if (err) {
    switch (err.code) {
      case 'PROTOCOL_CONNECTION_LOST': {
        console.error('Database connection was closed.');
        break;
      }
      case 'ER_CON_COUNT_ERROR': {
        console.error('Database has too many connections.');
        break;
      }
      case 'ECONNREFUSED': {
        console.error('Database connection was refused.');
        break;
      }
      default: {
        console.error(`Database connection error code: ${err.code}`);
      }
    }
  } else {
    console.log('Database connection test was successful');
  }
  if (connection) {
    connection.release();
  }
  return
})


export {
  pool
}
