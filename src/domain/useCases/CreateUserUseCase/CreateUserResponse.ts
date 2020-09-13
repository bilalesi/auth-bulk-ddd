import CreateUserUseCaseErrors from "./CreateUserErrors";
import AppError from "../../../core/AppError";
import Result from "../../../core/Result";
import User from "../../duser/duser";

export type CreateUserResponse = 
    CreateUserUseCaseErrors.UserWithEmailAlreadyExist |
    CreateUserUseCaseErrors.UserWithUserNameAlreadyExist |
    AppError.UnexpectedError |
    Result<void | boolean | User> 