import { createContainer, InjectionMode, asClass, asFunction, asValue } from "awilix";
import { Logger } from 'winston';

import configuration, { IEnvirementData } from "./config";
import Response, { IResponse } from './core/Response';
import Result, { IResult } from './core/Result';
import UseCaseError, { IUseCaseError } from "./core/UseCaseError";
import getLogger from './infrastructure/logging';
import InitiateDB from './config/databases';
import App from './app';
import UserRepository from './domain/repository/UserRepository'

interface ICradle{    
    configuration: IEnvirementData,
    getLogger: object,
    InitiateDb: InitiateDB,
    App: App,
    Response: Response,
    Result: Result<any>,
    UseCaseError: UseCaseError,
    UserRepos: UserRepository
}    

const IocContainer = createContainer<ICradle>({
    injectionMode: InjectionMode.PROXY
});


IocContainer.register({
    configuration: asValue(configuration),
    getLogger: asFunction(getLogger).singleton(),
    InitiateDb: asClass(InitiateDB).singleton(),
    App: asClass(App).singleton(),
    Response: asClass(Response).singleton(),
    Result: asClass(Result).singleton(),
    UseCaseError: asClass(UseCaseError).singleton(),
    UserRepos: asClass(UserRepository).singleton(),
})


export default IocContainer;

