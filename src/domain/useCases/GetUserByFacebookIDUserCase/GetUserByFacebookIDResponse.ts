import GetUserByFacebookIdErrors from "./GetUserByFacebookIDErrors";
import UserEmail from "../../duser/bo-user/UserEmail";
import Identity from './../../../core/Identity';
import User, { ISocialAccount } from '../../duser/duser'
import AppError from "../../../core/AppError";

export type IGetUserByFacebookIdResponse = 
            GetUserByFacebookIdErrors.FacebookUserNotfound |
            AppError.UnexpectedError |
            // Promise<ISocialAccount> |
            Promise<User>;
