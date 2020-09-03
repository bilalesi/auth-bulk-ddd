import { mergeAll } from "ramda";

import { existsSync } from "fs";
import { join } from "path";
import Result, { IResult } from '../core/Result';
import { IDatabase } from "./databases";


export interface IEnvirementData{
    [x: string]: any
}

export const ENV = process.env.NODE_ENV || 'development';
const envirementConfig: object = require(join(__dirname, 'envirements', ENV)).default;

export abstract class ConfigurationLoader{
    constructor(){}

    public static loadDbConfiguration(): Result<IDatabase>{ 
        if(!existsSync(join(__dirname, 'databases')))
        {
            return Result.opFail<IDatabase>('Database configuration not Found');
        }                
        return Result.opSuccess<IDatabase>(require(`${join(__dirname, 'databases')}/${ENV}`));
    }

    public static getConfig(): Result<IEnvirementData>  { 
        const dbConfigOrError = this.loadDbConfiguration();
        if(!dbConfigOrError.isSuccess)
            return Result.opFail<IDatabase>(dbConfigOrError.getErrorValue());
        const config: IEnvirementData = mergeAll(
            [
                { env: ENV },
                envirementConfig,
                dbConfigOrError.getValue() as IDatabase,
            ]
        );
        console.log('config: ',  JSON.stringify(config, null, 4))
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