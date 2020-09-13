import AppLogger from './Logger';

function getLogger({ configuration }){  
    const appLogger = new AppLogger(configuration);
    
    function logger(){
        return appLogger.logger();
    }

    return{
        logger
    }
}
export default getLogger;

