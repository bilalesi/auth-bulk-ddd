import { mergeAll } from "ramda";

import { existsSync } from "fs";
import { join } from "path";
import Result, { IResult } from '../core/Result';


export interface IEnvirementData{
    // env: string,
    // serverPort: number,
    [x: string]: any
}

export const ENV = process.env.NODE_ENV || 'development';
const envirementConfig: object = require(join(__dirname, 'envirements', ENV)).default;

export default class ConfigurationLoader{
    constructor(){}

    public loadDbConfiguration(): IResult<IEnvirementData | string>{ 
        if(existsSync(join(__dirname, 'databases', ENV)))
            return Result.opSuccess<IEnvirementData>(require('./databases')[ENV]);

        return Result.opFail<string>('Database configuration not Found');                
    }

    public getConfig(): Promise<IResult<IEnvirementData|string>>  {
        return new Promise((resolve, reject) => {
            // const dbConfigOrError = this.loadDbConfiguration();
            // if(!dbConfigOrError.isSuccess)
            //     reject(Result.opFail<string | IEnvirementData>(dbConfigOrError.getErrorValue()));
            console.log('env var dev:',ENV, envirementConfig)
            const config: IEnvirementData = mergeAll(
                [
                    { env: ENV },
                    // dbConfigOrError.getValue() as object,
                    envirementConfig
                ]
            );
            // console.log('config: ', typeof config)
            resolve(Result.opSuccess<IEnvirementData>(config));
        })
    }
}