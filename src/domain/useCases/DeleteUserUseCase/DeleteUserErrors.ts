import Result from "../../../core/Result";
import BaseUseCaseError from "../../../infrastructure/useCases/BaseUseCaseError";

namespace DeleteUserErrors{
    export class UserDoNotExistsError extends Result<BaseUseCaseError>{
        constructor(error?: any){
            super(false, {
                message: `[@DELTE_USER] user not found`,
                error: error
            } as BaseUseCaseError);
        }
    }

}

export default DeleteUserErrors;