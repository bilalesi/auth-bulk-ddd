import Result from "./Result";
import BaseUseCaseError from "../infrastructure/useCases/BaseUseCaseError";

namespace AppError{
    export class UnexpectedError extends Result<BaseUseCaseError>{
        constructor(error?: string){
            super(false, {
                message: `[@AppError] Unexpected error occured`,
                error: error
            })
        }
    }   
}

export default AppError;