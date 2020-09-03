import ValueObject from '../../../core/ValueObject';
import Result from '../../../core/Result';
import Checker from '../../../core/Checker';

interface IUserName{
    name: string
}

class UserName extends ValueObject<IUserName>{
    constructor(props: IUserName){
        super(props);
    }

    get username(){
        return this.props.name;
    }

    public static create(username: string): Result<UserName>{
        const isNotNullOrUndefined = Checker.NotNullOrUndefined(username);
        if(!isNotNullOrUndefined.valid)
            return Result.opFail<UserName>(isNotNullOrUndefined.msg)
        
        const isMinLength = Checker.GreaterThan(username, 5);
        if(!isMinLength.valid)
            return Result.opFail<UserName>(isMinLength.msg);
        
        return Result.opSuccess<UserName>(new UserName({ name: username }))
    }
}

export default UserName;