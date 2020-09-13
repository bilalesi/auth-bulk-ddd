
import BaseUseCase from './../../../infrastructure/useCases/BaseUserCase';
import IRequestDto from "./GetUserByIDDto";
import { IGetUserByIDResponse, OkResponse } from "./GetUserByIDResponse";
import UserRepository from './../../repository/UserRepository';
import UserID from '../../duser/bo-user/UserId';
import Identity from './../../../core/Identity';
import GetUserByIDErrors from './GetUserByIDErrors';
import AppError from '../../../core/AppError';

class GetUserByIDUseCase implements BaseUseCase<IRequestDto, IGetUserByIDResponse>{
    private userRepos: UserRepository;
    
    constructor({ UserRepos }){
        this.userRepos = UserRepos;
    }
    async run(request: IRequestDto) : Promise<IGetUserByIDResponse>{
        let dto: IRequestDto = request;
        const userIdOrError = UserID.build(new Identity(dto.id));
        if(!userIdOrError.isSuccess)
            return userIdOrError;
        const userId = userIdOrError.getValue();
        try {
            let exists = await this.userRepos.existsWithId(userId);
            if(!exists)
                return new GetUserByIDErrors.UserNotFoundError('Not exists in Db');
            let user = await this.userRepos.getUserById(userId)
            return {
                found: true,
                id: user.userId,
                userEmail: user.email
            } as OkResponse
        } catch (error) {
            return new AppError.UnexpectedError('User Not Found')
        }
    }
}

export default GetUserByIDUseCase;