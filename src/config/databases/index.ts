import mongoose from 'mongoose';
import { IEnvirementData } from './../index';
import Result from '../../core/Result';
import { Logger } from 'winston';


export interface IDatabase{
    host: string,
    port: string,
    username: string,
    password: string,
    database: string
}

class InitiateDB{
    private config: IEnvirementData;
    private logger: Logger;
    constructor({ configuration, getLogger }){
        this.config = configuration;
        this.logger = getLogger.logger();
    }

    public MongoConnect(){
        let { db: { host, port, username, password, database }, env }  = this.config;
        mongoose.Promise = global.Promise;
        if(env === 'development')
            mongoose.set('debug', true);
        
        mongoose.connection.on('error', (err) => {
            this.logger.error(`[@Database] Database error \n ${err}`);
        });
        mongoose.connection.on('disconnected', () => {
            this.logger.warn("[@Database] Database lost connection 'disconnection'");
        });
        mongoose.connection.on('open', () => {
            this.logger.info("[@Database] Database connected");
        });
        mongoose.connection.on('connecting', () => {
            this.logger.info("[@Database] App initiate database connection");
        });
        mongoose.connect(`mongodb://${host}:${port}/${database}`, {
            useNewUrlParser: true,
            poolSize: 5
        });
    }

    public  RethinkConnect(){

    }

    public  PostgresConnect(){

    }

}

export default InitiateDB;