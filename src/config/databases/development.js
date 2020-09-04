require('dotenv').config();

export const db = {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PWD,
    database: process.env.DEV_DB_NAME
}
