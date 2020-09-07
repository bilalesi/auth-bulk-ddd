interface IBaseUseCaseError{
    message: string,
    error?: any
}

abstract class BaseUseCaseError implements IBaseUseCaseError{
    public readonly message: string;
    public readonly error?: any;
    constructor(message: string, error?: any){
        this.message = message;
        this.error = error;
    }
}

export default BaseUseCaseError;