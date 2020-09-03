import ValueObject from './../../../core/ValueObject';
import Checker from './../../../core/Checker';
import  from "bcrypt";
import Result from '../../../core/Result';


interface IUserPassword{
    value: string,
    hashed?: boolean
}
/**
 * @desc this class implement all the necessary business logic for the password valueObject
 * minLength, hasALphaNumeric, hashPassowrd, comparePasswordWithHash
 */
class UserPassword extends ValueObject<IUserPassword>{
    private static minLength: number = 8;
    constructor(props: IUserPassword){
        super(props);
    }

    get value(){
        return this.props.value
    }
    private static isLegalPassword(value: string): Result<UserPassword> | boolean{
        const isNullOrUndefined = Checker.NotNullOrUndefined(value);
        if(!isNullOrUndefined.valid)
            return Result.opFail<UserPassword>('[@Password] Password is null or undefined');
        
            const isLengthAsRequired = value.length >= this.minLength
        if(!isLengthAsRequired)
            return Result.opFail<UserPassword>(`[@Password] Password must be at least ${this.minLength}`);
        
        const isAlaphNumeric = Checker.IsAlphanumeric(value)
        if(!isAlaphNumeric.valid)
            return Result.opFail<UserPassword>('[@Password] Passowrd mush have Alphanumeric caracters');

        return isNullOrUndefined.valid && isLengthAsRequired && isAlaphNumeric.valid;
    }
    private hashPassword(value: string): Promise<IUserPassword>{
        return new Promise((resolve, reject) => {
            if(this.isAlreadyHashed())
                resolve(this.props);
            else{
            }
        })
        
    }
    private getHashedPassword(){

    }
    
    private isAlreadyHashed(): boolean{
        return this.props.hashed;
    }
    private comparePassword(){

    }

    /**
     * name
     */
    public static create() {

    }
}