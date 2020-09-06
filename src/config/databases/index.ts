import mongoose from 'mongoose';
// import r from 'rethinkdb';
import { r, Connection, DBChangeResult, TableChangeResult } from 'rethinkdb-ts'
import asynco from 'async'
import { IEnvirementData } from './../index';
import { Logger } from 'winston';
import { error, table } from 'console';
import { create } from 'domain';
import { connect } from 'http2';


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

    private MongoConnect(){
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
            useFindAndModify: false,
            useUnifiedTopology: true,
            poolSize: 5
        });
    }

    private  RethinkConnect(){
        let { db: { host, port, username, password, database }, env }  = this.config;
        let rConnection: Connection;
        asynco.waterfall([
            (done) => {
                r.connect({
                    host, port
                }).then((coonection) => {
                    done(null, coonection)
                })
                .catch((err) => done(err, null))
            },
            (connection, done) => {               
                r.dbList().contains(database).run(connection).then(exists => {
                    r.dbCreate(database).run(connection).then((created: DBChangeResult) => {
                        if(!!created.dbs_created === true){
                            this.logger.info('[@Database] Database Successfuly created \n')
                            done(null, connection)                        
                        }
                    }).catch(err => {
                         this.logger.warn('[@Database] Database Already Exists \n', err)
                        done(null, connection)
                    })
                }).catch(err => {
                    this.logger.error('[@Database] Database Creation Stopped, Driver problem \n', error)
                    done(err, null)
                });
            }, 
            (connection, done) => {
                r.db(database).tableList().contains('Users').run(connection)
                    .then((exists: boolean) => {
                        r.db(database).tableCreate('Users').run(connection).then((created: TableChangeResult) => {
                            if(!!created.tables_created === true){
                                this.logger.info("[@Database] Database Table 'Users' Successfuly Created \n")
                                done(null, connection);
                            }
                        }).catch(err => {
                            this.logger.warn("[@Database] Database Table 'Users' Already exists  \n", error)
                            done(null, connection)
                        })
                    }).catch(err => done(err, null))
            },
        ], (error , connection: Connection) => {
            if(error || connection === null){
                this.logger.error("[@Database] Database error \n", error);
            }
            rConnection = connection;
        })
        return rConnection;
    }

    private  PostgresConnect(){

    }
    private MariaConnect(){

    }
    public configureDbAndLoad(){
        switch(this.config.dbType){
            case "MONGO":{
                this.MongoConnect();
                break;
            }
            case "RETHINK":{
                this.RethinkConnect();
                break;
            }
            case "MARIA":{
                this.MariaConnect();
                break;
            };
            case "POSTGRES":{
                this.PostgresConnect();
                break;
            }
            default:
                this.MongoConnect();
        }
    }

}

export default InitiateDB;