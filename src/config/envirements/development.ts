require('dotenv').config();

const developmentConfig = {
    appName: process.env.APP_NAME,
    serverPort: process.env.SERVER_PORT || 4000,
    dbType: process.env.DB_TYPE,
    loggingConfig: {
        maxsize: 10 * 1024,
        maxFiles: 2,
        colorize: true,
        zippedArchive: false,
    }
}


export default developmentConfig;
