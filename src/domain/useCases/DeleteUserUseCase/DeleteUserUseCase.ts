import mongoose from 'mongoose';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import BaseUseCase from './../../../infrastructure/useCases/BaseUserCase';
import { IDeleteUserDto } from './DeleteUserDto';
import { DeleteUserResponse } from './DeleteUserResponse';
import UserName from '../../duser/bo-user/UserName';
import UserEmail from '../../duser/bo-user/UserEmail';
import UserID from './../../duser/bo-user/UserId';
import Result from '../../../core/Result';
import UserRepository from './../../repository/UserRepository';
import DeleteUserErrors from './DeleteUserErrors';
import AppError from '../../../core/AppError';


class DeleteUserUseCase implements BaseUseCase<IDeleteUserDto, DeleteUserResponse>{
    private userRepos: UserRepository;

    constructor({ UserRepos }){
        this.userRepos = UserRepos;
    }
    async run(request: IDeleteUserDto): Promise<DeleteUserResponse> {
        const usernameOrError = request.username ? UserName.build({ name: request.username}): null;
        const userEmailOrError = request.email ? UserEmail.build({ value : request.email }): null;
        const userIDOrError = request.id ? UserID.build(request.id): null;

        console.log('testing: ',{usernameOrError, userEmailOrError, userIDOrError})
        const testRequest = Result.resultCombine([
            userEmailOrError, usernameOrError, userIDOrError
        ]);
        console.log('ddro!: ', {userEmailOrError, usernameOrError, userIDOrError})
        if(!testRequest.isSuccess){
            return testRequest;
        }
        let username = request.username && usernameOrError.getValue().value,
            email = request.email && userEmailOrError.getValue().value,
            id = request.id && userIDOrError.getValue().id;

        console.log('ddto: ', username, email, id )
        try {
            let userDeleted: boolean | FindAndModifyWriteOpResultObject<mongoose.Document> = await this.userRepos.delete({
                username, email, id
            })
            console.log('user deleted: ', userDeleted)
            if(userDeleted === false){
                return new DeleteUserErrors.UserDoNotExistsError();
            }
            return userDeleted;
        } catch (error) {
            return new AppError.UnexpectedError(error);
        }
    }
}


export default DeleteUserUseCase;