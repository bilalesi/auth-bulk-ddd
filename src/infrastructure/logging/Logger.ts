import { transports, createLogger, format, config, Logger } from "winston";
import loggerDRF from "winston-daily-rotate-file";
import appPath from 'app-root-path';
import { mergeAll } from "ramda";
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

import container from '../../ioc_container';
import { IEnvirementData } from '../../config/index'


const { colorize, label, timestamp, prettyPrint, combine } = format;

class AppLogger{
    private logPath: string;
    private config: IEnvirementData;
    constructor(configuration){
        if(!existsSync('logs'))        
            mkdirSync('logs');
        console.log('configuration:', configuration)
        this.config = configuration;
        this.logPath = path.join(appPath.path, 'logs');
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
                format: combine(
                    label({ label: this.config.appName}),
                    timestamp(),
                    colorize({
                        all: true
                    }),
                    prettyPrint(),
                ),
                filename: `logs/error-${this.config.env}-%DATE%.log`
            }, this.config.loggingConfig
        ])
        const logConfigInfo = mergeAll([
            { 
                level: 'info',
                format: combine(
                    label({ label: this.config.appName}),
                    timestamp(),
                    colorize({
                        all: true
                    }),
                    prettyPrint(),
                ),
                filename: `logs/info-${this.config.env}-%DATE%.log`
            }, this.config.loggingConfig
        ])
        return createLogger({
            levels: config.npm.levels,
            transports: [
                new transports.Console(),
                new transports.File(logConfigError),
                new transports.File(logConfigInfo),
                new loggerDRF({
                    datePattern: 'YYYY-MM-DD-HH',
                    filename: 'logs-%DATE%.log',
                    zippedArchive: false,
                    maxSize: '20m',
                    dirname: `logs/${this.config.env}/rotate`
                })
            ]
        })
    }
}

export default AppLogger;