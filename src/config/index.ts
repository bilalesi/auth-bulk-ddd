import { merge } from "ramda";
require('dotenv').load();

import { existsSync } from "fs";
import { join } from "path";
import Result from '../core/Result';


export interface IEnvirementData{
    version?: string,
    [x: string]: any
}

export const ENV = process.env.NODE_ENV || 'development';
const envirementConfig: object = require(join(__dirname, 'envirements', ENV));

export default class ConfigurationLoader{

    public static loadDbConfiguration(){
        if(existsSync(join(__dirname, 'databases', ENV)))
            return Result.opSuccess(require('./databases')[ENV]);
        
        return Result.opFail<string>('Database configuration  not Found');
    }

    public static getConfig(): IEnvirementData | string {
        return new Promise((resolve, reject) => {
            const dbConfigOrError = this.loadDbConfiguration();
            if(dbConfigOrError.isFailure)
                reject(Result.opFail(dbConfigOrError.getErrorValue()));

            const config: IEnvirementData = merge(
                dbConfigOrError.getValue(),
                envirementConfig
            )
             resolve(Result.opSuccess<IEnvirementData>(config));
        })
    }
}