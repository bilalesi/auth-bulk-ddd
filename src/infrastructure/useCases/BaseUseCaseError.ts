interface IBaseUseCaseError{
    message: string,
    error?: any,
    location?: string,
}

abstract class BaseUseCaseError implements IBaseUseCaseError{
    public readonly message: string;
    public readonly error?: any;
    public readonly location?: string;
    constructor(message: string, error?: any, location?: string){
        this.message = message;
        this.error = error;
        this.location= location;
    }
}

export default BaseUseCaseError;