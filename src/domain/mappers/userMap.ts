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
import UserID from '../duser/bo-user/UserId';
import Identity from './../../core/Identity';

interface UserDto{

}
class UserMap implements IMapper<UserDto, User, Promise<any>> {
    public static async toPersistence(user: User): Promise<any>{
        let password: string;
        if(!!user.password === true){
            if(!user.password.isAlreadyHashed())
                password = user.password.value;
            else{
                try {
                    password = await user.password.getHashedValue();                    
                } catch (error) {
                    console.log('passworn can not be hashed, \n', error)
                }
            }
        }

        return{
            username: user.username.value,
            firstname : user.firsName.Name,
            lastname : user.lastName.Name,
            address : user.address.value,
            phone: user.phone.value,
            email: user.email.value,
            role: user.role,
            password : password,         
        }
    }
    public static toDto(user: User){

    }
    public static toDomain(raw: any): User{
        const usernameOrError = UserName.build({ name : raw.username});
        const passwordOrError = UserPassword.build({ value: raw.password, hashed: true});
        const firstnameOrError = Name.build({ name : raw.firstname });
        const lastnameOrError = Name.build({ name : raw.lastname });
        const emailOrName = UserEmail.build({ value: raw.email});
        const phoneOrError = UserPhone.build({ value: raw.phone});
        const addressOrError = UserAddress.build({ ...raw.address});
        const roleOrError = !!raw.role === true ? raw.role : Role.USER;
        const idOreError = UserID.build(raw._id as Identity);
        let resultTest: Result<any> = Result.resultCombine([
            usernameOrError,
            firstnameOrError,
            lastnameOrError,
            emailOrName,
            phoneOrError,
            addressOrError,
            passwordOrError,
            idOreError
        ])
        const userOrError = resultTest.isSuccess && User.build({
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
        }, idOreError.getValue().id);
        
        return userOrError.isSuccess ? userOrError.getValue() : null
    }
}

export default UserMap;