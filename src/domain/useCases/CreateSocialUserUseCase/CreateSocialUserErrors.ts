import Result from "../../../core/Result";
import BaseUseCaseError from './../../../infrastructure/useCases/BaseUseCaseError';

namespace CreateSocialUserUseCaseErrors{
    export class SocialAccountOfProviderXAlreadyExist extends Result<BaseUseCaseError>{
        constructor(error?: string, provider?: string){
            super(false, {
                message: `An account for this Provider Already exists`,
                error: `Account for ${provider} Already exists`
            })
        }
    }
}

export default CreateSocialUserUseCaseErrors;