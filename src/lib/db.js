import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_incp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
