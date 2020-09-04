import ValueObject from '../../../core/ValueObject';
import Result from '../../../core/Result';
import Checker from '../../../core/Checker';

export interface IUserName{
    name: string
}

class UserName extends ValueObject<IUserName>{
    constructor(props: IUserName){
        super(props);
    }

    get value(){
        return this.props.name;
    }

    public static build(props: IUserName): Result<UserName>{
        const isNotNullOrUndefined = Checker.NotNullOrUndefined(props.name);
        if(!isNotNullOrUndefined.valid)
            return Result.opFail<UserName>(isNotNullOrUndefined.msg)
        
        const isMinLength = Checker.GreaterThan(props.name, 5);
        if(!isMinLength.valid)
            return Result.opFail<UserName>(isMinLength.msg);
        
        return Result.opSuccess<UserName>(new UserName({
            name: props.name
        }))
    }
}

export default UserName;