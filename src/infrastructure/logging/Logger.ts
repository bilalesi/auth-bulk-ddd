import { transports, createLogger, format, config, Logger, stream,  } from "winston";
import loggerDRF from "winston-daily-rotate-file";
import appPath from 'app-root-path';
import { mergeAll } from "ramda";
import { existsSync, mkdirSync, exists } from 'fs';
import path from 'path';
import moment from 'moment';
import { IEnvirementData } from '../../config/index'


const { colorize, label, timestamp, prettyPrint, combine, simple, splat, ms, metadata, align } = format;

class AppLogger{
    private config: IEnvirementData;
    public appLogger: Logger;
    constructor(configuration){
        if(!existsSync('logs')){
            mkdirSync('logs');
            exists(path.join(appPath.path, 'logs'), exist => {
                this.appLogger.error('[@AppLogsError] Logs Directory not created');
            })
        }      
        this.config = configuration;
    }
    // private winstonformat = format.printf(({level, message, ...meta}) => {
    //     if(meta){
    //         let { timestamp, label, } = meta
    //         return `${timestamp}`
    //     }
    // })
    public logger(): Logger{
        const logConfigError = mergeAll([
            { 
                level: 'error',
                handleExceptions: true,
                format: combine(
                    label({ label: this.config.appName}),
                    splat(),
                    timestamp(),                    
                    prettyPrint(),
                    ms(),
                    align(),
                    metadata(),
                    simple()
                ),
                filename: `logs/error-${this.config.env}-${(moment().format('DD-MM-YYYY'))}.log`
            }, this.config.loggingConfig
        ])
        const logConfigInfo = mergeAll([
            { 
                level: 'info',
                handleExceptions: true,
                format: combine(
                    label({ label: this.config.appName}),
                    timestamp(),
                    splat(),
                    prettyPrint(),
                    ms(),
                    align(),
                    metadata(),
                    simple()
                ),
                filename: `logs/info-${this.config.env}-${(moment().format('DD-MM-YYYY'))}.log`,                
            }, this.config.loggingConfig
        ])
        this.appLogger = createLogger({
            levels: config.npm.levels,
            transports: [
                new transports.Console({
                    level: 'debug',                    
                    format: combine(
                        splat(),
                        // json(),
                        colorize(),
                        prettyPrint(),
                        ms(),
                        align(),
                        metadata(),
                        simple()
                    )
                }),
                new transports.File(logConfigError),
                new transports.File(logConfigInfo),
                new loggerDRF({
                    datePattern: 'YYYY-MM-DD-HH',
                    filename: `logs-${this.config.env}-rotate-%DATE%.log`,
                    zippedArchive: false,
                    handleExceptions: true,
                    maxSize: '20m',
                    dirname: `logs/`,
                    json: true                
                })
            ],
            exitOnError: false
        })
        return this.appLogger;
    }
}

export default AppLogger;