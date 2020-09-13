import Result from "../../../core/Result";
import BaseUseCaseError from './../../../infrastructure/useCases/BaseUseCaseError';

namespace CreateUserUseCaseErrors{
    export class UserWithEmailAlreadyExist extends Result<BaseUseCaseError>{
        constructor(email: string){
            super(false, {
                message: `[@ADD_USER] email ${email} associated for this account Already exists`
            }, email)
            console.log('this constructor email: ', this)
        }        
    }
    export class UserWithUserNameAlreadyExist extends Result<BaseUseCaseError>{
        constructor(username: string){
            super(false, {
                message: `[@ADD_USER] ${username} is Already taken by another account`
            }, username)
            console.log('this constructor username: ', this)
        }
    }
}

export default CreateUserUseCaseErrors;