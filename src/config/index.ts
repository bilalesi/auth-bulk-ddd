import { mergeAll } from "ramda";

import { existsSync } from "fs";
import { join } from "path";
import Result, { IResult } from '../core/Result';


export interface IEnvirementData{
    [x: string]: any
}

export const ENV = process.env.NODE_ENV || 'development';
const envirementConfig: object = require(join(__dirname, 'envirements', ENV)).default;

export abstract class ConfigurationLoader{
    constructor(){}

    public static loadDbConfiguration(): IResult<IEnvirementData | string>{ 
        if(existsSync(join(__dirname, 'databases', ENV)))
            return Result.opSuccess<IEnvirementData>(require('./databases')[ENV]);

        return Result.opFail<string>('Database configuration not Found');                
    }

    public static getConfig(): IResult<IEnvirementData|string>  { 
        // const dbConfigOrError = this.loadDbConfiguration();
        // if(!dbConfigOrError.isSuccess)
        // return Result.opFail<string | IEnvirementData>(dbConfigOrError.getErrorValue());
        const config: IEnvirementData = mergeAll(
            [
                { env: ENV },
                // dbConfigOrError.getValue() as object,
                envirementConfig
            ]
        );
        // console.log('config: ', typeof config)
        return Result.opSuccess<IEnvirementData>(config);
    }
}

function generateConfig(): IEnvirementData{
    const configOrError = ConfigurationLoader.getConfig();
    if(!configOrError.isSuccess)
        console.log('[@ConfigurationError] configuration not loaded correctly');
    
    return configOrError.getValue() as IEnvirementData;
}
const configuration = generateConfig();
export default configuration;