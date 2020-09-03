import Identity from '../Identity';

export interface IEntity<T>{
    equals: (object?: Entity<T>) => boolean,
    getEntityProps: () => T
}

/**
 * @desc the Entity class represent any entity of the domain
 * which will compared by the _id as describe DDD.
 */

 
abstract class Entity<T> implements IEntity<T>{
    protected readonly _id: Identity;
    private readonly props: T;

    constructor(props: T, id? : Identity){
        this.props = props;
        this._id = id ? id : new Identity();
    }

    equals(object? : Entity<T>): boolean{
        if(object === null || object === undefined)
            return false;
        if(!(object instanceof this.constructor))
            return false;
        
        if(object === this)
            return true;
        
        return this._id.equals(object._id);
    }

    getEntityProps(): T{
        return this.props;
    }
}

export default Entity;