import { createContainer, InjectionMode, asClass, asFunction, asValue } from "awilix";
import { Logger } from 'winston';
import mongoose from 'mongoose';

import configuration, { IEnvirementData } from "./config";
import Response, { IResponse } from './core/Response';
import Result, { IResult } from './core/Result';
import UseCaseError, { IUseCaseError } from "./core/UseCaseError";
import getLogger from './infrastructure/logging';
import InitiateDB from './config/databases';
import App from './app';
import UserRepository from './domain/repository/UserRepository';
import { CreateUserUseCase } from './domain/useCases/CreateUserUseCase/CreateUserUseCase';
import { CreateUserController } from './domain/useCases/CreateUserUseCase/CreateUserController';
import DeleteUserUseCase from "./domain/useCases/DeleteUserUseCase/DeleteUserUseCase";
import DeleteUserController from './domain/useCases/DeleteUserUseCase/DeleteUserController';

interface ICradle{    
    configuration: IEnvirementData,
    getLogger: object,
    InitiateDb: InitiateDB,
    App: App,
    Response: Response,
    Result: Result<any>,
    UserRepos: UserRepository,
    CreateUserUC: CreateUserUseCase,
    DeleteUserUC: DeleteUserUseCase,
    CreateUserController: CreateUserController,
    DeleteUserController: DeleteUserController
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
    UserRepos: asClass(UserRepository).singleton(),
    CreateUserUC: asClass(CreateUserUseCase).scoped(),
    DeleteUserUC: asClass(DeleteUserUseCase).scoped(),
    CreateUserController: asClass(CreateUserController).scoped(),
    DeleteUserController: asClass(DeleteUserController).scoped(),
})


export default IocContainer;

