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

    private isValidName(name: string): boolean{
        const isNotNullOrUndefined = Checker.NotNullOrUndefined(name);
        return isNotNullOrUndefined.valid;
    }

    public create(name: string): Result<Name>{
        if(!this.isValidName(name))
            return Result.opFail<Name>('[@Name] Name not Valid')

        return Result.opSuccess<Name>(new Name({
            name: name
        }))
    }
}

export default Name;
