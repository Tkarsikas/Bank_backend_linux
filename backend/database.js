const db = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
const connection = db.createPool(process.env.SQL_SERVER);


module.exports=connection;
