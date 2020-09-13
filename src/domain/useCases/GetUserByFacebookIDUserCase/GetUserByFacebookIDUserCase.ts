import BaseUseCase from './../../../infrastructure/useCases/BaseUserCase';
import { IGetUserByFacebookIdDto } from "./GetUserByFacebookIDDto";
import { IGetUserByFacebookIdResponse } from "./GetUserByFacebookIDResponse";
import GetUserByFacebookIDErrors from "./GetUserByFacebookIDErrors";
import UserRepository from './../../repository/UserRepository';
import { ISocialAccount } from '../../duser/duser';
import AppError from '../../../core/AppError';
import { id } from 'inversify';

class GetUserByFacebookIDUseCase implements BaseUseCase<IGetUserByFacebookIdDto, IGetUserByFacebookIdResponse>{
    private userRepos: UserRepository;
    constructor( UserRepos ){
        this.userRepos = UserRepos;
    }

    async run(request: IGetUserByFacebookIdDto): Promise<IGetUserByFacebookIdResponse>{
        let dto = request.id;
        console.log('dto facebook account: ', dto);
        try {
            let user = await this.userRepos.getUserFacebookAccount(dto);
            if(!!user.socialAccount == false){
                return new GetUserByFacebookIDErrors.FacebookUserNotfound('Facebook Account not attached yet');
            }
            return user;
            // return {
            //     socialId: user.facebook?.socialId,
            //     localId: user.userId,
            //     emails: user.facebook?.emails,
            //     Photos: user.facebook?.Photos
            // } as ISocialAccount;
        } catch (error) {
            return new AppError.UnexpectedError('[@SOCIAL_FACEBOOK_ACCOUNT] Social Account Not Defined yet')
        }
    }
}

export default GetUserByFacebookIDUseCase;
