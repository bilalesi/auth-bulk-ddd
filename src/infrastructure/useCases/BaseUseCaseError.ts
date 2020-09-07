interface IBaseUseCaseError{
    message: string,
    error?: string
}

abstract class BaseUseCaseError implements IBaseUseCaseError{
    public readonly message: string;
    public readonly error?: string;
    constructor(message: string, error?: string){
        this.message = message;
        this.error = error;
    }
}

export default BaseUseCaseError;