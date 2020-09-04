require('dotenv').config();

export const db = {
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PWD,
    database: process.env.TEST_DB_NAME
}
