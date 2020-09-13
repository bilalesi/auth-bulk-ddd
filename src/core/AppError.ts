import Result from "./Result";
import BaseUseCaseError from "../infrastructure/useCases/BaseUseCaseError";

namespace AppError{
    export class UnexpectedError extends Result<BaseUseCaseError>{
        constructor(error?: any, loc?: string){
            super(false, {
                message: `[@AppError] Unexpected error occured`,
                error: error,
                location: loc
            } as BaseUseCaseError)
        }
    }   
}

export default AppError;