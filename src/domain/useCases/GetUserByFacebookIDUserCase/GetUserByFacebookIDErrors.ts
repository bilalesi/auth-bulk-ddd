import Result from "../../../core/Result";
import BaseUseCaseError from './../../../infrastructure/useCases/BaseUseCaseError';

namespace GetUserByFacebookIdErrors{
    export class FacebookUserNotfound extends Result<BaseUseCaseError>{
        constructor(err?: any){
            super(false, {
                message: `[@FACEBOOK_USer] facebook user not found`,
                error: err
            })
        }
    }
}

export default GetUserByFacebookIdErrors;