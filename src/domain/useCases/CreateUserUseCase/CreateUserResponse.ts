import CreateUserUseCaseErrors from "./CreateUserErrors";
import AppError from "../../../core/AppError";
import Result from "../../../core/Result";

export type CreateUserResponse = 
    CreateUserUseCaseErrors.UserWithEmailAlreadyExist |
    CreateUserUseCaseErrors.UserWithUserNameAlreadyExist |
    AppError.UnexpectedError |
    Result<void | boolean>