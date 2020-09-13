require('dotenv').config();

const developmentConfig = {
    appName: process.env.APP_NAME,
    serverPort: process.env.SERVER_PORT || 4000,
    serverHttpsPort: process.env.SERVER_HTTP_PORT || 5000,
    dbType: process.env.DB_TYPE,
    loggingConfig: {
        maxsize: 10 * 1024,
        maxFiles: 2,
        colorize: true,
        zippedArchive: false,
    },
    facebookClientID: process.env.FACEBOOK_APP_ID,
    facebookAppSecretKey: process.env.FACEBOOK_APP_SECRET,
    facebookCallbackUrl: process.env.FACEBOOK_APP_CALLBACK
}


export default developmentConfig;
