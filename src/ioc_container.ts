import { createContainer, InjectionMode, asClass, asFunction, asValue } from "awilix";
 
import Config from "./config";
import Response, { IResponse } from './core/Response';
import Result, { IResult } from './core/Result';
import UseCaseError, { IUseCaseError } from "./core/UseCaseError";
import App from './app';

// interface ICradle{
//     Response: Response,
//     Result: Result<any>,
//     UseCaseError: UseCaseError
// }    

const IocContainer = createContainer({
    injectionMode: InjectionMode.PROXY
});


IocContainer.register({
    Config: asValue(Config),
    App: asFunction(App).singleton(),
    Response: asClass(Response).singleton(),
    Result: asClass(Result).singleton(),
    UseCaseError: asClass(UseCaseError).singleton()
})


export default IocContainer;

