import ValueObject from './../../../core/ValueObject';
import Checker from './../../../core/Checker';
import Result from '../../../core/Result';
import { unfold } from 'ramda';

export interface IName{
    name: string,
}
 
class Name extends ValueObject<IName>{
    constructor(props: IName){
        super(props);
    }

    get Name(){
        return this.props.name;
    }

    private static isValidName(name: string): boolean{
        const isNotNullOrUndefined = Checker.NotNullOrUndefined(name);
        return isNotNullOrUndefined.valid;
    }

    public static create(props: IName): Result<Name>{
        if(!this.isValidName(props.name))
            return Result.opFail<Name>('[@Name] Name not Valid')

        return Result.opSuccess<Name>(new Name({
            name: props.name
        }))
    }
}

export default Name;
