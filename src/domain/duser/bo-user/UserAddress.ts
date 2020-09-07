
import ValueObject from './../../../core/ValueObject';
import Checker from './../../../core/Checker';
import Result from '../../../core/Result';
import { is } from 'ramda';


interface IUserAddress{
    local?: string,
    state: string,
    city?: string,
    zip?: number
}

class UserAddress extends ValueObject<IUserAddress>{
    constructor(props: IUserAddress){
        super(props);
    }
    get value(){
        let props = this.props
        return { ...{ ...props }};
    }
    private static isValidAdderss(props: IUserAddress): boolean{
        const isStateNotNullOrUndefined = Checker.NotNullOrUndefined(props.state)
        return isStateNotNullOrUndefined.valid
    }   

    public static build(props: IUserAddress): Result<UserAddress>{
        if(!this.isValidAdderss(props))
            return Result.opFail<UserAddress>('[@Address] State must be included in the address');

        return Result.opSuccess<UserAddress>(new UserAddress(props))
    }
}


export default UserAddress;