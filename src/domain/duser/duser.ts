import moment, { Moment } from 'moment';
import Entity from "../../core/Entity";
import UserName  from './bo-user/UserName';
import UserEmail  from './bo-user/UserEmail';
import UserPassword  from './bo-user/UserPassword';
import UserPhone  from './bo-user/UserPhone';
import Name  from './bo-user/Name';
import UserID from './bo-user/UserId';
import Identity from './../../core/Identity';
import UserAddress from './bo-user/UserAddress';
import Result from '../../core/Result';
import Checker from './../../core/Checker';

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}
interface IUser{
    username: UserName,
    firstName: Name,
    lastName: Name,
    email: UserEmail,
    phone: UserPhone,
    address: UserAddress,
    password: UserPassword,
    isEmailVerified?: boolean,
    createdAt?: Moment,
    modifiedAt?: Moment,
    lastLogin?: Moment,
    role?: Role
}


class User extends Entity<IUser>{
    constructor(props: IUser, id?: Identity ){
        super(props, id);
    }

    get userId(): UserID{
        return UserID.build(this._id).getValue();
    }
    get username(): UserName{
        return this.props.username;
    }
    get firsName(): Name{
        return this.props.firstName;
    }
    get lastName(): Name{
        return this.props.lastName;
    }
    get address(): UserAddress{
        return this.props.address;
    }
    get phone(): UserPhone{
        return this.props.phone;
    }
    get password(): UserPassword{
        return this.props.password;
    }
    get isEmailVerified(): boolean{
        return this.props.isEmailVerified;
    }
    get modifiedAt(): Moment{
        return this.props.modifiedAt;
    }
    get lastLogin(): Moment{
        return this.props.lastLogin;
    }
    get role(): Role{
        return this.props.role;
    }
    
    public static build(props: IUser, id?: Identity): Result<User>{
        const isNotNullOrUndefined = Checker.NotNullOrUndefinedBulk([
            props.username.value,
            props.email.value,
            props.phone.value,
            props.address.value
        ])
        if(!isNotNullOrUndefined.valid)
            return Result.opFail<User>('[@UserCreation] user cannot be created (null or undefined)');
        
        const user = new User({
            ...props,
            isEmailVerified: props.isEmailVerified ? props.isEmailVerified : false,
            createdAt: props.createdAt ? props.createdAt : moment(),
            role: props.role ? props.role : Role.USER
        })

        // TODO event for creation the new user;

        return Result.opSuccess<User>(user);
    }
}

export default User;