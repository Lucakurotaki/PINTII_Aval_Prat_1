import 'dotenv/config';
const {Client} = require('pg');

const credenciais = {
    user: "postgres",
    host: "localhost",
    database: "avalprat1",
    password: process.env.PG_KEY,
    port : 15432,
}

export {Client, credenciais};