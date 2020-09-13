import mongoose from 'mongoose';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import IUserRepository from './IUserRepository';
import UserID from '../duser/bo-user/UserId';
import UserPhone from '../duser/bo-user/UserPhone';
import UserName from '../duser/bo-user/UserName';
import User from '../duser/duser';
import UserEmail from '../duser/bo-user/UserEmail';
import MUser from "../../infrastructure/database/mongodb/UserModel";
import { Logger } from 'winston';
import UserMapper from "../mappers/userMap";
import userEmail from '../duser/bo-user/UserEmail';
import userMap from '../mappers/userMap';
import { IDeleteUserDto } from '../useCases/DeleteUserUseCase/DeleteUserDto';
import Result from '../../core/Result';
import { boolean } from 'yup';
import UserMap from '../mappers/userMap';
import { ICreateSocialUserDto } from './../useCases/CreateSocialUserUseCase/CreateSocialUserUseCase';


// implements IUserRepository
class UserRepository implements IUserRepository {
    private logger: Logger;
    constructor({ getLogger }){
        this.logger = getLogger.logger();
    }
    async existsWithId(userId: UserID): Promise<boolean>{
        try {
            let user =  await MUser.findById(userId.id).exec();
            if(!!user === true)
                return true;
            else return false
        } catch (error){
            this.logger.debug('[@USER_ID_EXISTS] find by userId not working correctly \n', error);
            return false
        }
    }
    async existsWithPhone(userPhone: UserPhone): Promise<boolean>{
        try {
            let user = await MUser.findOne({ phone: userPhone.value }).exec();
            if(!!user === true)
                return true;
        } catch (error) {
            this.logger.debug('[@USER_PHONE_EXISTS] find by user phone not working correctly \n', error);
            return false;
        }
    };
    async existsWithUsername(username: UserName): Promise<boolean>{
        try {
            let user = await MUser.findOne({ username: username.value }).exec();            
            if(!!user === true)
                return !!user === true;
            else return false;
        } catch (error) {
            this.logger.debug('[@USERNAME_EXISTS] find by username not working correctly \n', error);
            return false;
        }
    };
    async existsWithEmail(userEmail: UserEmail): Promise<boolean>{
        try {
            let user = await MUser.findOne({ email : userEmail.value }).exec()
            // console.log('user: ', user)
            if(!!user === true)
                return !!user === true;
            else return false;
        } catch (error) {
            this.logger.debug('[@USEREMAIL_EXISTS] find by user email not working correctly \n', error);
            return false;
        }        
    };
    async existsSocialAccountByProvider(provider: string, id: string): Promise<boolean>{
        try {
            console.log('++++++++++++++++ user social from db +++++++++++++++',)
            let user = await MUser.findOne({ "socialAccounts.provider": provider, "socialAccounts.socialId": id }).exec();
            if(!!user === true) return !!user === true;
            else return false;
        } catch (error) {
            this.logger.info(`[@SOCIAL${provider}_ERROR] getting user social details failed \n`, error);
            return false;
        }
    }
    async getUserById(userId: UserID): Promise<User>{
        try {
            if(await this.existsWithId( userId )){
                let user = await MUser.findById(userId.id );
                return (UserMapper.toDomain(user));
            }
        } catch (error) {
            this.logger.debug('[@GET_USER_ID] get user by Id details not working correctly \n', error);
            return (null)
        }
    };
    async getUserByUsername(username: UserName): Promise<User>{
        try {
            await this.existsWithUsername( username as UserName )
            let user = await MUser.findOne({ username: username.value }).exec();
            return userMap.toDomain(user);
        } catch (error) {
            this.logger.debug('[@GET_USER_NAME] get user by username details not working correctly \n', error);
        }
    };
    async getUserByUserEmail(userEmail: UserEmail): Promise<User>{
        try {
            await this.existsWithEmail( userEmail as UserEmail )
            let user = await MUser.findOne({ email: userEmail.value}).exec();
            return UserMapper.toDomain(user);                
        } catch (error) {
            this.logger.debug('[@GET_USER_EMAIL] get user by username details not working correctly \n', error);
        }        
    };
    async getUserFacebookAccount(_id: string): Promise<User>{
        try {
            let raw = await MUser.findOne({
                "socialAccounts.provider": { $eq: 'facebook' }
            }).exec();
            console.log('raw facebook:', raw);
            if(!!raw === true)
                return UserMapper.toDomain(raw);
        } catch (error) {
            this.logger.debug('[@GET_USER_FACEBOOK] get user facebook account details not working correctly \n', error);            
        }
    }
    async save(user: User): Promise<User>{
        try {
            let exists = await this.existsWithEmail(user.email);
            console.log('saving: exists: ', exists)
            if(!exists){
                let userToSaveMapped = await UserMapper.toPersistence(user);
                let userDoc = new MUser(userToSaveMapped);
                let userSaved = await userDoc.save();
                this.logger.info('[@SAVE_USER] user saved successfuly \n');
                return UserMap.toDomain(userSaved);
            }            
        } catch (error) {
            console.log('saving: Error catch: ', error)
            this.logger.warn('[@SAVE_USER] user already exists \n', error);
        }
    };
    async delete(props: IDeleteUserDto): Promise<FindAndModifyWriteOpResultObject<mongoose.Document> | boolean>{
        let { id, email, username } = props
        try {
            if(id){
                let exists = await this.existsWithId(UserID.build(id).getValue());
                if(!exists)
                    return false

                let userRemoved: FindAndModifyWriteOpResultObject<mongoose.Document> = await MUser.findOneAndDelete({ _id: id }, {
                    rawResult: true, 
                    select:{ _id: 1, email: 1, username: 1}
                })                
                this.logger.info('[@DELETE_USER_ID] User Deleted by ID');
                return userRemoved;
            }
            else if(email){
                let exists = await this.existsWithEmail(userEmail.build({ value: email}).getValue());
                if(!exists)
                    return false
                let userRemoved = await MUser.findOneAndDelete({ email: email }, {
                    rawResult: true, 
                    select:{ _id: 1, email: 1, username: 1}
                });
                return userRemoved;
                this.logger.info('[@DELETE_USER_EMAIL] User Deleted by Email');
            }
            else if(username){
                let exists = await this.existsWithUsername(UserName.build({ name: username}).getValue());
                if(!exists)
                    return false

                let userRemoved = await MUser.findOneAndDelete({ username : username }, {
                    rawResult: true, 
                    select:{ _id: 1, email: 1, username: 1}
                });
                return userRemoved;
                this.logger.info('[@DELETE_USER_USERNAME] User Deleted by Email');
            }
        } catch (error) {
            this.logger.info('[@DELETE_USER] User can not be Deleted \n', error);
            return false;
        }
    }
    async saveSocialAccount(user: ICreateSocialUserDto): Promise<mongoose.Document | boolean>{
        let doc = {
            username: user.username,
            firstname: user.firstname ,
            lastname: user.lastname ,
            email: user.email ,
            socialAccounts: [
                user.social
            ]
        }
        try {
            let userDoc = new MUser(doc);
            console.log('++++++++++++++++ user doc', userDoc)
            let userToSave = await userDoc.save();
            this.logger.info(`[@SOCIAL${user.social.provider}_SAVE_USER] user saved successfuly \n`);
            return userToSave;
        } catch (error) {
            this.logger.warn(`[@SOCIAL_SAVE_USER] not saved \n`, error);
            return false;
        }
    }
    async updateSocialAccount(user: ICreateSocialUserDto): Promise<mongoose.Document | boolean>{
        try {
            let userToUpdate = await MUser.findOneAndUpdate({ email: user.email }, {
                $push: {
                    socialAccounts: user.social
                }
            }, {
                new: true, 
                upsert: true,
                rawResult: true
            })
            this.logger.info('[@SAVE_USER] user updated successfuly \n');
            return userToUpdate.value;
        } catch (error) {
            this.logger.warn('[@SAVE_SOCIAL_USER] user not updated \n');
            return false;
        }
    }
}

export default UserRepository;