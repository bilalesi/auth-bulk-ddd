import passport from "passport";
import fbstrategy from "passport-facebook";
import express from 'express';
import UserRepository from './../repository/UserRepository';
import { ConfigurationLoader } from "../../config";
import { IEnvirementData } from './../../config/index';
import GetUserByIDUseCase from './../useCases/GetUserByIDUseCase/GetUserByIDUseCase';
import CreateUserUseCase from './../useCases/CreateUserUseCase/CreateUserUseCase';
import CreateUserUC from './../useCases/CreateUserUseCase/CreateUserUseCase';
import CreateSocialUserUC, {  CreateSocialUserResponse, ICreateSocialUserDto } from './../useCases/CreateSocialUserUseCase/CreateSocialUserUseCase';
import GetUserByFacebookIdErrors from "../useCases/GetUserByFacebookIDUserCase/GetUserByFacebookIDErrors";
import Result from "../../core/Result";
import BaseUseCase from './../../infrastructure/useCases/BaseUserCase';
import BaseUseCaseError from "../../infrastructure/useCases/BaseUseCaseError";
import User, { ISocialAccount } from "../duser/duser";
import UserEmail from "../duser/bo-user/UserEmail";
import UserName from "../duser/bo-user/UserName";
import Name from "../duser/bo-user/Name";
import { ICreateUserDto } from './../useCases/CreateUserUseCase/CreateUserDto';
import userMap from "../mappers/userMap";
import GetUserByFacebookIDUseCase from '../useCases/GetUserByFacebookIDUserCase/GetUserByFacebookIDUserCase'
import { CreateUserResponse } from "../useCases/CreateUserUseCase/CreateUserResponse";
import CreateUserUseCaseErrors from "../useCases/CreateUserUseCase/CreateUserErrors";
import AppError from "../../core/AppError";
import CreateSocialUserUseCaseErrors from "../useCases/CreateSocialUserUseCase/CreateSocialUserErrors";
import { Document } from "mongoose";

const FacebookStrategy = fbstrategy.Strategy;

require('dotenv').config();



const FacebookStrategyAuthenticate = ({ configuration, GetUserByFacebookIDUC, CreateUserUC, CreateSocialUserUC }) => {
    function Authenticate(app: express.Express): void {
        let GUFAID_UC: GetUserByFacebookIDUseCase = GetUserByFacebookIDUC;
        let CU_UC: CreateUserUC = CreateUserUC;
        let CSUA_UC: CreateSocialUserUC = CreateSocialUserUC;

        passport.serializeUser(function (user, done){
            console.log("++++ serialzing user : ", user)
            done(null, user)
        })
        passport.deserializeUser(function(id, done){
            console.log("++++ deserialzing user : ", id)
            done(null, id)
        })
        passport.use(new FacebookStrategy(
            {
                clientID: configuration.facebookClientID,
                clientSecret: configuration.facebookAppSecretKey,
                callbackURL: configuration.facebookCallbackUrl
            },
            async (accessTeken: string, refreshToken: string,
                profile: fbstrategy.Profile, done) => {
                let _id = profile.id;
                try {
                    let userOrError = await GUFAID_UC.run({ id: _id });
                    if (userOrError instanceof GetUserByFacebookIdErrors.FacebookUserNotfound
                        || userOrError instanceof AppError.UnexpectedError 
                    ) {                        
                        let { id, emails, name, username, photos, provider } = profile;
                        let user = {
                            email: emails && emails[0].value,
                            username: username,
                            firstname: name.givenName,
                            lastname: name.familyName,
                            social: {
                                socialId: id,
                                provider: provider,
                            }
                        } as ICreateSocialUserDto;
                        let iuserOrError: CreateSocialUserResponse = await CSUA_UC.run(user);
                        if(!iuserOrError.isSuccess){
                            let gh = iuserOrError as Result<BaseUseCaseError>;
                            switch (gh.constructor) {
                                case CreateSocialUserUseCaseErrors.SocialAccountOfProviderXAlreadyExist:
                                case AppError.UnexpectedError:
                                    return done(iuserOrError.getErrorValue(), false);                                
                            }
                        }
                        return done(null, iuserOrError.getValue() as Document);
                    }
                } catch (error) {
                    return done(error, false, { message: "Facebook Authentication failed" });
                }
            }
        ))
        app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}))
        app.get('/auth/facebook/callback', passport.authenticate('facebook', {
            failureRedirect: '/login',
            successRedirect: '/',
            scope: ['email']
        }))
    }

    return{
        Authenticate
    }
}

export default FacebookStrategyAuthenticate;