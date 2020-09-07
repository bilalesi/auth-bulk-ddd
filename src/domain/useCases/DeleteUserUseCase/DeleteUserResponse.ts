import DeleteUserErrors from './DeleteUserErrors'
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import mongoose from 'mongoose';

export type DeleteUserResponse = 
            DeleteUserErrors.UserDoNotExistsError |
            FindAndModifyWriteOpResultObject<mongoose.Document> |
            Promise<any>;