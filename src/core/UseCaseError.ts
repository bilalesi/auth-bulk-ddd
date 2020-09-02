export interface IUseCaseError{
    message? : string
}

export default class UseCaseError implements IUseCaseError{
    public readonly message: string;

    constructor(message?: string){
        this.message = message
    }
}