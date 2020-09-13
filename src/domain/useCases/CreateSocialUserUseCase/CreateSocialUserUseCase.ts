import mongoose from 'mongoose';
import Result from "../../../core/Result";
import BaseUseCase from './../../../infrastructure/useCases/BaseUserCase';
import UserRepository from './../../repository/UserRepository';
import UserEmail from "../../duser/bo-user/UserEmail";
import CreateSocialUserUseCaseErrors from "./CreateSocialUserErrors";
import User from "../../duser/duser";
import AppError from "../../../core/AppError";

export interface ICreateSocialUserDto{
    email?: string,
    username?: string,
    firstname?: string,
    lastname?: string,
    social?: {
        socialId?: string,
        provider?: string,        
        Photos?: string,
    }
}
export type CreateSocialUserResponse = 
                AppError.UnexpectedError |
                CreateSocialUserUseCaseErrors.SocialAccountOfProviderXAlreadyExist |
                Result<mongoose.Document> |
                Result<boolean>;

class CreateSocialUserUseCase implements BaseUseCase<ICreateSocialUserDto, CreateSocialUserResponse>{
    private userRepos: UserRepository
    constructor({ UserRepos }){
        this.userRepos = UserRepos;
    }   
    
    async run(request: ICreateSocialUserDto): Promise<CreateSocialUserResponse> {
        console.log('++++++++++++++++ creation social user account request +++++++++++++++', request)        
        let dto: ICreateSocialUserDto = request;
        console.log('++++++++++++++++ creation social user account dto +++++++++++++++', dto)
        try {
            let isProviderAlreadyExist = await this.userRepos.existsSocialAccountByProvider(request.social.provider, request.social.socialId);
            console.log('++++++++++++++++ isProviderAlreadyExist +++++++++++++++', isProviderAlreadyExist)
            if(isProviderAlreadyExist){
                return new CreateSocialUserUseCaseErrors.SocialAccountOfProviderXAlreadyExist('bommm', request.social.provider);
            }

            let exists: boolean = false;
            let searchByEmail = false;
            if(dto.email !== undefined){
                searchByEmail = true
                let emailOrError = UserEmail.build({ value : dto.email });
                if(!emailOrError.isSuccess)
                    exists = await this.userRepos.existsWithEmail(emailOrError.getValue());
            }

            
            console.log('++++++++++++++++ exists +++++++++++++++', exists)
            
            if(!exists && dto.social.socialId ){
               let saved =  await this.userRepos.saveSocialAccount(request);
               if(saved) return Result.opSuccess<mongoose.Document>(saved as mongoose.Document);
               else return Result.opFail<boolean>('Social Account for the user not saved');
            }
            else if(exists && dto.social.socialId){
                let userUpdated = await this.userRepos.updateSocialAccount(request);
                if(typeof userUpdated !== 'boolean') Result.opSuccess<mongoose.Document>(userUpdated as mongoose.Document);
                else Result.opFail<boolean>('Social Account for the user not updated');
            }

        } catch (error) {
            return new AppError.UnexpectedError(error, 'Social Account not created CreateSocialUserUseCase class');
        }
    }
}

export default CreateSocialUserUseCase;