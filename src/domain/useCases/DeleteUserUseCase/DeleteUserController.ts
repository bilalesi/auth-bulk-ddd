import { BaseController } from "../../../infrastructure/useCases/BaseController";
import * as express from 'express';
import mongoose from 'mongoose';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import { IDeleteUserDto } from './DeleteUserDto';
import BaseUseCase from './../../../infrastructure/useCases/BaseUserCase';
import DeleteUserUseCase from './DeleteUserUseCase';
import { DeleteUserResponse } from "./DeleteUserResponse";
import DeleteUserErrors from "./DeleteUserErrors";

class DeleteUserController extends BaseController{
    private useCase: DeleteUserUseCase;
    constructor({ DeleteUserUC }){
        super();
        this.useCase = DeleteUserUC;
    }
    async run(req: express.Request, res: express.Response): Promise<void | any>{
        const dto: IDeleteUserDto = req.body as IDeleteUserDto;
        try{
            let response: DeleteUserResponse =  await this.useCase.run(dto);
            if(response instanceof DeleteUserErrors.UserDoNotExistsError){
                let err = response.getErrorValue()
                return this.fail400(res, 400, err);            
            }
            else {
                console.log("+++++++++++++ response dto", response)
                let dto : FindAndModifyWriteOpResultObject<mongoose.Document> = response as FindAndModifyWriteOpResultObject<mongoose.Document>;
                return this.ok200(res, dto)
            }
        }
        catch(err){
            this.fail400(res, 400, err);
        }
    }
}

export default DeleteUserController;