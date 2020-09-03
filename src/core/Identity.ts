import { v4 as identifierV4, } from "uuid";
type IdentityType = string | number;

class Identity{
    private readonly id: IdentityType

    constructor(value?: IdentityType){
        this.id = value ? value : identifierV4()
    }

    equals(id?: Identity): boolean{
        if(id === null || id === undefined){
            return false
        }
        else if(!(id instanceof this.constructor))
            return false;

        return id.getValue() === this.id;
    }

    getValue(): IdentityType{
        return this.id;
    }
}

export default Identity;