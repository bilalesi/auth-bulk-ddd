import { createContainer, InjectionMode, asClass, asFunction, asValue } from "awilix";
 
import Config from "./config";
import Response, { IResponse } from './core/Response';
import Result, { IResult } from './core/Result';
import UseCaseError, { IUseCaseError } from "./core/UseCaseError";
import App from './app';

interface ICradle{
    Configuration: Config,
    App: App,
    Response: Response,
    Result: Result<any>,
    UseCaseError: UseCaseError
}    

const IocContainer = createContainer<ICradle>({
    injectionMode: InjectionMode.PROXY
});


IocContainer.register({
    Configuration: asClass(Config).singleton(),
    App: asClass(App).singleton(),
    Response: asClass(Response).singleton(),
    Result: asClass(Result).singleton(),
    UseCaseError: asClass(UseCaseError).singleton()
})


export default IocContainer;

