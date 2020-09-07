import IUserRepository from './IUserRepository';
import mongoose from 'mongoose';
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


// implements IUserRepository
class UserRepository implements IUserRepository {
    private logger: Logger;
    constructor(getLogger: Logger){
        this.logger = getLogger;
    }
    async existsWithId(userId: UserID): Promise<boolean>{
        try {
            let user =  await MUser.findById(userId.id).exec();
            if(!!user === true)
                return true;
        } catch (error){
            this.logger.debug('[@USER_ID_EXISTS] find by userId not working correctly \n', error);
        }
    }
    async existsWithPhone(userPhone: UserPhone): Promise<boolean>{
        try {
            let user = await MUser.findOne({ phone: userPhone.value }).exec();
            if(!!user === true)
                return true;
        } catch (error) {
            this.logger.debug('[@USER_PHONE_EXISTS] find by user phone not working correctly \n', error);
        }
    };
    async existsWithUsername(username: UserName): Promise<boolean>{
        try {
            let user = await MUser.findOne({ username: username.value }).exec();            
            if(!!user === true)
                return !!user === true;
        } catch (error) {
            this.logger.debug('[@USERNAME_EXISTS] find by username not working correctly \n', error);
        }
    };
    async existsWithEmail(userEmail: UserEmail): Promise<boolean>{
        try {
            let user = await MUser.findOne({ email : userEmail.value }).exec()
            // console.log('user: ', user)
            if(!!user === true)
                return !!user === true;
        } catch (error) {
            this.logger.debug('[@USEREMAIL_EXISTS] find by user email not working correctly \n', error);
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
                this.logger.debug('[@USER] get user by Id details not working correctly \n', error);
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
            this.logger.debug('[@USER] get user by username details not working correctly \n', error);
        }
    };
    async getUserByUserEmail(userEmail: UserEmail): Promise<User>{
        try {
            await this.existsWithEmail( userEmail as UserEmail )
            let user = await MUser.findOne({ email: userEmail.value}).exec();
            return UserMapper.toDomain(user);                
        } catch (error) {
            this.logger.debug('[@USER] get user by username details not working correctly \n', error);
        }        
    };
    async save(user: User): Promise<void>{
        try {
            let exists = await this.existsWithEmail(user.email);
            if(!exists){
                let userToSaveMapped = await UserMapper.toPersistence(user);
                let userDoc = new MUser(userToSaveMapped); 
                let userOrError = await userDoc.save();
                this.logger.info('[@USER] user saved successfuly \n');
            }
        } catch (error) {
            this.logger.warn('[@USER] user already exists \n', error);
        }
    };
}

export default UserRepository;