import { v4 } from "uuid";

class Identity{
    private readonly id: string

    constructor(value?: string){
        this.id = value ? value : v4() as string
    }

    equals(id?: Identity): boolean{
        if(id === null || id === undefined){
            return false
        }
        else if(!(id instanceof this.constructor))
            return false;

        return id.value === this.id;
    }

    get value(): string{
        return this.id;
    }
}

export default Identity;