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
    getUserById(userId: UserID): Promise<User>{
        return new Promise(async (resolve, reject) => {
            try {
                if(await this.existsWithId( userId )){
                    let user = await MUser.findById(userId.id );
                    resolve(UserMapper.toDomain(user));
                }
                    reject(null)
            } catch (error) {
                this.logger.debug('[@GET_USER_ID] get user by Id details not working correctly \n', error);
                reject(null)
            }
        })
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
    async save(user: User): Promise<void>{
        try {
            let exists = await this.existsWithEmail(user.email);
            console.log('saving: exists: ', exists)
            if(!exists){
                let userToSaveMapped = await UserMapper.toPersistence(user);
                let userDoc = new MUser(userToSaveMapped);
                let userOrError = await userDoc.save();
                this.logger.info('[@SAVE_USER] user saved successfuly \n');
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
}

export default UserRepository;