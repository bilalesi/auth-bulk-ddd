/**
 * Usercase interact with the repository and the controller && the Repository
 * is responsible to interact with database, so the usecase will be passed as 
 * dependency injection to useCaseController
 */

import IUserRepository from './../../repository/IUserRepository';
import { ICreateUserDto } from './CreateUserDto';
import UserName from '../../duser/bo-user/UserName';
import UserEmail from '../../duser/bo-user/UserEmail';
import UserPhone from '../../duser/bo-user/UserPhone';
import UserPassword from '../../duser/bo-user/UserPassword';
import Result from '../../../core/Result';
import User, { Role } from '../../duser/duser';
import UserAddress from '../../duser/bo-user/UserAddress';
import Name from '../../duser/bo-user/Name';
import BaseUseCase from './../../../infrastructure/useCases/BaseUserCase';
import CreateUserUseCaseErrors from './CreateUserErrors';
import AppError from '../../../core/AppError';
import { CreateUserResponse } from './CreateUserResponse';


export default class CreateUserUseCase implements BaseUseCase<ICreateUserDto, CreateUserResponse> {
    
    private userRepo: IUserRepository
    constructor( { UserRepos } ) {
        this.userRepo = UserRepos;
    }

    public async run(request: ICreateUserDto): Promise<CreateUserResponse> {
        const userEmailOrError = UserEmail.build({ value: request.email });
        const userPasswordOrError = UserPassword.build({ value: request.password });

        const userNameOrError = request.username ? UserName.build({ name: request.username }) : null;
        const userPhoneOrError = request.phone ? UserPhone.build({ value: request.phone }) : null;
        const userAdderssOrError = request.state ? UserAddress.build(
            {
                state: request.state,
                city: request.city,
                local: request.local,
                zip: request.zip
            }
        ) : null;
        const userFirstNameOrError = request.firstname ? Name.build({ name: request.firstname }) : null
        const userLastNameOrError = request.lastname ? Name.build({ name: request.lastname }) : null
        const socialAccount = request.socialAccount;

        let testRequest = Result.resultCombine([
            userNameOrError, userEmailOrError, userPhoneOrError, userPasswordOrError,
            userAdderssOrError, userFirstNameOrError, userLastNameOrError
        ]);

        if (!testRequest.isSuccess) {
            return testRequest;
        }

        const userEmail: UserEmail = userEmailOrError.getValue();
        const userPhone: UserPhone = userPhoneOrError.getValue();
        const userName: UserName = userNameOrError.getValue();
        const firstName: Name = userFirstNameOrError.getValue();
        const lastName: Name = userLastNameOrError.getValue();
        const address: UserAddress = userAdderssOrError.getValue();
        const userPassword: UserPassword = userPasswordOrError.getValue();

        try {
            if (userEmailOrError !== null) {
                let isUserExists = await this.userRepo.existsWithEmail(userEmailOrError.getValue());
                console.log('++++++ isUserExists', isUserExists)
                if (isUserExists) {
                    return new CreateUserUseCaseErrors.UserWithEmailAlreadyExist(userEmail.value);
                }
            }
            
            try {
                let isUsernameTaken = await this.userRepo.existsWithUsername(userNameOrError.getValue());
                if (isUsernameTaken)
                    return new CreateUserUseCaseErrors.UserWithUserNameAlreadyExist(userName.value)
            }
            catch (error) { 
                console.log('+++++++++++ error verifing user: ', error)
            }

            let user: Result<User> = User.build({
                username: userName,
                password: userPassword,
                email: userEmail,
                firstName: firstName,
                lastName: lastName,
                phone: userPhone,
                address: address,
                role: Role.USER,
                socialAccount: socialAccount
            })

            let userSaved = await this.userRepo.save(user.getValue())
            console.log('======================================')
            console.log('result test: ', userSaved)
            console.log('======================================')

            return Result.opSuccess<User>(userSaved) as Result<User>;

        } catch (error) {
            console.log('errorr application', error)
            return new AppError.UnexpectedError(error);
        }
    }
}