import moment from 'moment';
import User, { Role } from "../duser/duser";
import { IMapper } from '../../infrastructure/mappers/Mapper';
import UserName from "../duser/bo-user/UserName";
import Name from "../duser/bo-user/Name";
import UserEmail from "../duser/bo-user/UserEmail";
import UserPhone from "../duser/bo-user/UserPhone";
import UserAddress from "../duser/bo-user/UserAddress";
import UserPassword from "../duser/bo-user/UserPassword";
import Result from '../../core/Result';

interface UserDto{

}
class UserMap implements IMapper<UserDto, User, Promise<any>> {
    public static async toPersistence(user: User): Promise<any>{
        let password: string;
        if(!!user.password === true){
            if(!user.password.isAlreadyHashed())
                password = user.password.value;
            else
                password = await user.password.getHashedValue();
        }

        return{
            firstname : user.firsName.Name,
            lastname : user.lastName.Name,
            address : user.address.value,
            password : password,
            isEmailVerified : user.isEmailVerified,
            lastLogin : user.lastLogin.toDate(),
            role : user.role,
        }
    }
    public static toDto(user: User){

    }
    public static toDomain(raw: any): User{
        const usernameOrError = UserName.create({ name : raw.username});
        const passwordOrError = UserPassword.create({ value: raw.password, hashed: true});
        const firstnameOrError = Name.create({ name : raw.firstname });
        const lastnameOrError = Name.create({ name : raw.lastname });
        const emailOrName = UserEmail.create({ value: raw.email});
        const phoneOrError = UserPhone.create({ value: raw.phone});
        const addressOrError = UserAddress.create({ ...raw.address});
        const roleOrError = !!raw.role === true ? raw.role : Role.USER;

        let resultTest: Result<any> = Result.resultCombine([
            usernameOrError,
            firstnameOrError,
            lastnameOrError,
            emailOrName,
            phoneOrError,
            addressOrError,
            passwordOrError
        ])
        const userOrError = resultTest.isSuccess && User.create({
            username: usernameOrError.getValue(),
            firstName: firstnameOrError.getValue(),
            lastName: lastnameOrError.getValue(),
            email: emailOrName.getValue(),
            phone: phoneOrError.getValue(),
            address: addressOrError.getValue(),
            isEmailVerified: raw.isEmailVerified,
            createdAt: moment(raw.created_at),
            modifiedAt: moment(raw.updated_at),
            password: passwordOrError.getValue(),
            role: raw.role in Role ? raw.role : 'USER'
        })
        return userOrError.isSuccess ? userOrError.getValue() : null
    }
}