/**
 * This Class implement the possible results for any operation
 * the operation my successed or failed 
 * the return object is the result state (success or fail)
 * and the error if fail, or the data(value) if success;
 */

import debug from 'debug';

export interface IResult<T>{
    isSuccess: boolean,
    isFailure: boolean,
    _error: T | string,
    _value: T | string,

    getValue: () => T | string,
    getErrorValue: () => T | string,
}

export default class Result<T> implements IResult<T>{
    public isSuccess: boolean;
    public isFailure: boolean;
    public _error: T | string;
    public _value: T | string;

    constructor(success: boolean, error?: T | string, value?: T | string) {
        if(success && error)
            throw new Error('[@InvalidOperation] the result cannot be success and contain error');
        else if(!success && !error )
            throw new Error('[@InvalidOpertaion] a failing result must contain error');
        
        this.isSuccess = success;
        this.isFailure = !success;
        this._error = error;
        this._value = value;

        Object.freeze(this);
    }

    public static opSuccess<U>(value?: U) : Result<U>{
        return new Result<U>(true, null, value)
    }

    public static opFail<U>(error?: U): Result<U> {
        return new Result(false, error);
    }

    public getValue() : T | string {
        if(this.isFailure){
            console.log('error resulr: ', this._error);
            debug('debugging error: ', this._error);
            throw new Error('[@BadUseFunction] to get the error use getErrorValue');
        }
        return this._value as T;
    }

    public getErrorValue() : T | string{
        return this._error as T;
    }
}