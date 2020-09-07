import { v4 } from 'uuid'
import Identity from './../../../core/Identity';

export interface IDeleteUserDto{
    id?: Identity,
    username?: string,
    email?: string
}