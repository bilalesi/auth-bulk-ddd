import ValueObject from './../../../core/ValueObject';
import Result from '../../../core/Result';

export interface IUserPhone{
    phone: string
}

class UserPhone extends ValueObject<IUserPhone>{
    constructor(props: IUserPhone){
        super(props);
    }

    get phone(){
        return this.props.phone;
    }

    private isValidPhone(phone: string): boolean{
        let rPhone = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/;
        return  rPhone.test(phone)
    }

    public create(phone: string): Result<UserPhone>{
        if(this.isValidPhone(phone))
            return Result.opFail<UserPhone>('[@Phone] User phone not valid');
        return Result.opSuccess<UserPhone>(new UserPhone({
            phone: phone
        }))
    }
}

export default UserPhone;