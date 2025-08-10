import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "ptinticore",
  password: "4bZ&8eEQyjqQw,mg6.Ea",
  database: "db_incp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
