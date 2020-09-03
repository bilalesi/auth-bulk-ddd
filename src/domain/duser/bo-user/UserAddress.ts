
import ValueObject from './../../../core/ValueObject';
import Checker from './../../../core/Checker';
import Result from '../../../core/Result';
import { is } from 'ramda';


interface IUserAddress{
    localAddress?: string,
    state: string,
    city?: string,
    zip?: number
}

class UserAddress extends ValueObject<IUserAddress>{
    constructor(props: IUserAddress){
        super(props);
    }

    private static isValidAdderss(state: string, city?: string, zip?: number, local?: string): boolean{
        const isStateNotNullOrUndefined = Checker.NotNullOrUndefined(state)
        return isStateNotNullOrUndefined.valid
    }   

    public static create(state: string, city?: string, zip?: number, local?: string): Result<UserAddress>{
        if(this.isValidAdderss(state, city, zip, local))
            return Result.opFail<UserAddress>('[@Address] State must be included in the address');

        return Result.opSuccess<UserAddress>(new UserAddress({
            city,
            state,
            zip,
            localAddress: local
        }))
    }
}


export default UserAddress;