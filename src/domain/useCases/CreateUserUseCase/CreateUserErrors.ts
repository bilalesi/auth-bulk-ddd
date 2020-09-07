import Result from "../../../core/Result";
import BaseUseCaseError from './../../../infrastructure/useCases/BaseUseCaseError';

namespace CreateUserUseCaseErrors{
    export class UserWithEmailAlreadyExist extends Result<BaseUseCaseError>{
        constructor(email: string){
            super(false, {
                message: `The email ${email} associated for this account Already exists`
            }, email)
        }
    }
    export class UserWithUserNameAlreadyExist extends Result<BaseUseCaseError>{
        constructor(username: string){
            super(false, {
                message: `The ${username} is Already taken by another account`
            }, username)
        }
    }
}

export default CreateUserUseCaseErrors;