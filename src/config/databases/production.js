require('dotenv').config();

export const db = {
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PWD,
    database: process.env.PROD_DB_NAME
}
