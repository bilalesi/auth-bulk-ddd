const productionConfig = {
    serverPort: process.env.SERVER_PORT || 4000,
    dbType: process.env.DB_TYPE,
}

export default productionConfig;