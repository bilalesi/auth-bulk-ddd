import Entity from "../Entity";
import Identity from './../Identity';

class AggregateRoot<T> extends Entity<T>{
    private aprops: T;
    constructor(props: T, id: Identity){
        super(null, id);        
        this.aprops = props;
    }

    get aggProps(){
        return this.aprops;
    }
}