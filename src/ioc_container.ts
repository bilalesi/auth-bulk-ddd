import { createContainer, InjectionMode, asClass, asFunction, asValue } from "awilix";
import { Logger } from 'winston';

import configuration, { IEnvirementData } from "./config";
import Response, { IResponse } from './core/Response';
import Result, { IResult } from './core/Result';
import UseCaseError, { IUseCaseError } from "./core/UseCaseError";
import getLogger from './infrastructure/logging';
import App from './app';

interface ICradle{
    configuration: IEnvirementData,
    getLogger: object,
    App: App,
    Response: Response,
    Result: Result<any>,
    UseCaseError: UseCaseError
}    

const IocContainer = createContainer<ICradle>({
    injectionMode: InjectionMode.PROXY
});


IocContainer.register({
    configuration: asValue(configuration),
    getLogger: asFunction(getLogger).singleton(),
    App: asClass(App).singleton(),
    Response: asClass(Response).singleton(),
    Result: asClass(Result).singleton(),
    UseCaseError: asClass(UseCaseError).singleton()
})


export default IocContainer;

