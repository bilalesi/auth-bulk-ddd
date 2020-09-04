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
import userEmail from '../duser/bo-user/dist/userEmail';
// implements IUserRepository
class UserRepository {
    private logger: Logger;
    constructor({ getLogger }){
        this.logger = getLogger;
    }
    existsWithId(userId: UserID): Promise<boolean>{
        return new Promise(async (resolve, reject) => {
            try {
                let user =  await MUser.findById(userId.id);
                if(!!user === true)
                resolve(true)
            } catch (error){
                this.logger.debug('[@USER_ID_EXISTS] find by userId not working correctly \n', error);
                reject(false)
            }

        });
    }
    existsWithPhone(userPhone: UserPhone): Promise<boolean>{
        return new Promise(async (resolve, reject) => {
            try {
                let user = await MUser.find({ phone: userPhone.value })
                if(!!user === true)
                    resolve(true);
            } catch (error) {
                this.logger.debug('[@USER_PHONE_EXISTS] find by user phone not working correctly \n', error);
                reject(false)
            }
        });
    };
    existsWithUsername(username: UserName): Promise<boolean>{
        return new Promise(async (resolve, reject) => {
            try {
                let user = await MUser.find({ phone: username.value })
                if(!!user === true)
                    resolve(true);
            } catch (error) {
                this.logger.debug('[@USERNAME_EXISTS] find by username not working correctly \n', error);
                reject(false)
            }
        })
    };
    existsWithEmail(userEmail: UserEmail): Promise<boolean>{
        return new Promise(async (resolve, reject) => {
            try {
                let user = await MUser.find({ phone: userEmail.value })
                if(!!user === true)
                    resolve(true);
            } catch (error) {
                this.logger.debug('[@USEREMAIL_EXISTS] find by user email not working correctly \n', error);
                reject(false)
            }
        })
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
    getUserByUsername(username: UserName): Promise<User>{
        return new Promise(async (resolve, reject) => {
            try {
                if(await this.existsWithUsername( username as UserName )){
                    let user = await MUser.findOne({ username: username.value });
                    resolve(UserMapper.toDomain(user));
                }
                    reject(null)
            } catch (error) {
                this.logger.debug('[@USER] get user by username details not working correctly \n', error);
                reject(null)
            }
        })
    };

    getUserByUserEmail(userEmail: UserEmail): Promise<User>{
        return new Promise(async (resolve, reject) => {
            try {
                if(await this.existsWithEmail( userEmail as UserEmail )){
                    let user = await MUser.findOne({ email: userEmail.value});
                    resolve(UserMapper.toDomain(user));
                }
                    reject(null)
            } catch (error) {
                this.logger.debug('[@USER] get user by username details not working correctly \n', error);
                reject(null)
            }
        })
    };

    save(user: User): Promise<void>{
        return new Promise( async (resolve, reject) => {
            try {
                let userToSaveMapped = UserMapper.toPersistence(user);
                let userDoc = new MUser(userToSaveMapped); 
                let userOrError = await userDoc.save();
                this.logger.info('[@USER] user saved successfuly \n');
                resolve()
            } catch (error) {
                this.logger.warn('[@USER] user not saved \n', error);
            }
        })
    };
}

export default UserRepository;