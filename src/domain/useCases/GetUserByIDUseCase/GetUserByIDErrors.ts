import Result from "../../../core/Result";
import BaseUseCaseError from "../../../infrastructure/useCases/BaseUseCaseError";

namespace GetUserByIDErrors{
    export class UserNotFoundError extends Result<BaseUseCaseError>{
        constructor(err?: string){
            super(false, {
                message: '[@GET_USER_ID] User by ID Not Found',
                error: err
            })
        }
    }
}

export default GetUserByIDErrors;