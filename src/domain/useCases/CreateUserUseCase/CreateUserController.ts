import * as express from 'express';
import dompurify from 'dompurify';
import { BaseController } from '../../../infrastructure/useCases/BaseController';
import { CreateUserUseCase } from './CreateUserUseCase';
import { ICreateUserDto } from './CreateUserDto';
import { CreateUserResponse } from './CreateUserResponse';
import CreateUserUseCaseErrors from './CreateUserErrors';
import BaseUseCaseError from '../../../infrastructure/useCases/BaseUseCaseError';

 
export class CreateUserController extends BaseController {
    private useCase: CreateUserUseCase;
    constructor({ CreateUserUC }) {
        super()
        this.useCase = CreateUserUC;
    }
    async run(req: express.Request, res: express.Response): Promise<void | any> {
        let dto: ICreateUserDto = req.body as ICreateUserDto;
        let  username = (dto.username).toString(),
            firstname = (dto.firstname).toString(),
            lastname = (dto.lastname).toString(),
            email = (dto.email).toString(),
            phone = (dto.phone).toString(),
            state = (dto.state).toString(),
            city = (dto.city).toString(),
            zip = +(dto.zip.toString()),
            local = (dto.local).toString(),
            password = dto.password

        dto = { username, firstname, lastname, email, 
            phone, state, city, zip, local, password
        }
        
        try {
            let result: CreateUserResponse = await this.useCase.run(dto);

            if (!result.isSuccess && result.getErrorValue() instanceof BaseUseCaseError) {
                let gh = result.getErrorValue() as BaseUseCaseError;
                switch (gh.constructor) {
                    case CreateUserUseCaseErrors.UserWithEmailAlreadyExist:
                        return this.fail400(res, 409, 'Conflict, User Email Already Exist');
                    case CreateUserUseCaseErrors.UserWithUserNameAlreadyExist:
                        return this.fail400(res, 409, 'Conflict, User name Already Taken');
                    default:
                        return this.fail500(res, gh.message);
                }
            }
            else if(!result.isSuccess){
                return this.fail400(res, 400, result.getErrorValue() as string)
            }
            else {
                return this.ok200(res, result.getValue());
            }
        } catch (error) {
            return this.fail400(res, 400, error);
        }
    }
}

export default CreateUserController;