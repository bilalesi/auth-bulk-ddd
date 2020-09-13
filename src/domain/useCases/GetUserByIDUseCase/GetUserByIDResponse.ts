import UserID from './../../duser/bo-user/UserId';
import UserEmail from '../../duser/bo-user/UserEmail';
import GetUserByIDErrors from './GetUserByIDErrors';
import Identity from './../../../core/Identity';

export interface OkResponse{
    found: boolean,
    id?: UserID,
    userEmail?: UserEmail
}
export type IGetUserByIDResponse = 
        GetUserByIDErrors.UserNotFoundError
        | Promise<OkResponse>
        | Promise<any>
