import Result from "./Result";
import BaseUseCaseError from "../infrastructure/useCases/BaseUseCaseError";

namespace AppError{
    export class UnexpectedError extends Result<BaseUseCaseError>{
        constructor(error?: any){
            super(false, {
                message: `[@AppError] Unexpected error occured`,
                error: error
            } as BaseUseCaseError)
        }
    }   
}

export default AppError;