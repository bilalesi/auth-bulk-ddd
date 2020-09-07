import ValueObject from './../../../core/ValueObject';
import Result from '../../../core/Result';

export interface IUserPhone{
    value: string
}

class UserPhone extends ValueObject<IUserPhone>{
    constructor(props: IUserPhone){
        super(props);
    }

    get value(){
        return this.props.value;
    }

    private static isValidPhone(phone: string): boolean{
        let rPhone = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/;
        return  rPhone.test(phone)
    }

    public static build(props: IUserPhone): Result<UserPhone>{
        if(!this.isValidPhone(props.value))
            return Result.opFail<UserPhone>('[@Phone] User phone not valid');
        return Result.opSuccess<UserPhone>(new UserPhone({
            value: props.value
        }))
    }
}

export default UserPhone;