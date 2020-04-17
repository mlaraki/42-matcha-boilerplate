const { Client } = require("pg");
require('dotenv').config()

const databaseConfig = { connectionString: process.env.DATABASE_URL };
const client = new Client(databaseConfig);
(async function () {
    try {
      await client.connect();
      console.log("\x1b[32m", "DB connected");
    } catch (err) {
      console.error("\x1b[31m","connection error : ", err.stack);
    }
  })();

module.exports = {
    client
}
