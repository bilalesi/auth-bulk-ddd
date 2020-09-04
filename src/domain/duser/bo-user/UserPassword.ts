import ValueObject from './../../../core/ValueObject';
import Checker from './../../../core/Checker';
import bcrypt  from "bcrypt";
import Result from '../../../core/Result';


export interface IUserPassword{
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
    private static isLegalPassword(props: IUserPassword): Result<UserPassword>{
        const isNullOrUndefined = Checker.NotNullOrUndefined(props.value);
        if(!isNullOrUndefined.valid)
            return Result.opFail<UserPassword>('[@Password] Password is null or undefined');
        
            const isLengthAsRequired = props.value.length >= this.minLength
        if(!isLengthAsRequired)
            return Result.opFail<UserPassword>(`[@Password] Password must be at least ${this.minLength}`);
        
        const isAlaphNumeric = Checker.IsAlphanumeric(props.value)
        if(!isAlaphNumeric.valid)
            return Result.opFail<UserPassword>('[@Password] Passowrd mush have Alphanumeric caracters');

        return Result.opSuccess<UserPassword>(new UserPassword({
            value: props.value,
            hashed: !!props.hashed === true
        }));
    }
    private hashPassword(value: string): Promise<string>{
        return new Promise((resolve, reject) => {            
            bcrypt.genSalt(5, (err, salt) => {
                if(err) reject(err)
                bcrypt.hash(value, salt, (error, encryptedValue) => {
                    if(error) reject(error);
                    resolve(encryptedValue)
                }) 
            })            
        })        
    }
    public getHashedValue(): Promise<string>{
        return new Promise((resolve, reject) => {
            if(this.isAlreadyHashed())
                resolve(this.props.value);
            else{
                resolve(this.hashPassword(this.props.value))
            }        
        })
    }    
    public isAlreadyHashed(): boolean{
        return this.props.hashed;
    }
    private comparePassword(value: string): Promise<boolean>{
        return new Promise((resolve, reject) => {
            bcrypt.compare(value, this.props.value, (err, same) => {
                if(err) reject(false)
                resolve(same);
            })
        })
    }

    /**
     * @method create user passowrd after meeting cretaria
     */
    public static build(props: IUserPassword): Result<UserPassword>{
        const { value, hashed } = props;
        const testResult = this.isLegalPassword(props);
        if(!testResult.isSuccess)
            return Result.opFail<UserPassword>('[@Password] can not create password');
        
        return Result.opSuccess<UserPassword>(new UserPassword({ 
            value: props.value,
            hashed: !!props.hashed === true
        }))
    }
}

export default UserPassword;