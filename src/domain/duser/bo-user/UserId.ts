import ValueObject from '../../../core/ValueObject';
import Entity from '../../../core/Entity';
import Identity from '../../../core/Identity';
import Result from '../../../core/Result';

export default class UserID extends Entity<any>{
    constructor(id?: Identity){
        super(null, id)
    }

    get id(){
        return this._id;
    }

    public static build(id?: Identity): Result<UserID>{
        console.log('UserID class: ', id)
        return Result.opSuccess<UserID>(new UserID(id))
    }
}