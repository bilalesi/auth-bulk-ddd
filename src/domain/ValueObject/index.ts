import shallowequal from "shallowequal";

interface IValueObject{
    [index: string] : any
}

abstract class ValueObject<T extends IValueObject>{
    protected props: T;
    constructor(value){
        this.props = {
            ...value
        }
    }

    equals(vo?: T){
        if(vo === null || vo === undefined)
            return false
        
        return shallowequal(vo, this.props)
    }
}

export default ValueObject;