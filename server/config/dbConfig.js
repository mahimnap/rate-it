const mysql = require('mysql2'); 
//dotenv not needed here because it is in server and node applies it to the whole project 
//automatically on configuration

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PWD,
    database: 'rateit',
});

module.exports = pool; 