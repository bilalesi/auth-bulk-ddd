import * as yup from 'yup';
import { validate } from 'uuid';
import { type } from 'ramda';


interface ICheckerValidateSchema{
    valid: boolean,
    msg?: string
}

class Checker{ 
    public static NotNullOrUndefined(value: any): ICheckerValidateSchema {
        if(value === null || value === undefined)
            return {
                valid: false,
                msg: `${value} is Null or Undefined`
            }
        return{
            valid: true,
            msg: `${value} is Correct`
        }
    }
    public static NotNullOrUndefinedBulk(values: any[]): ICheckerValidateSchema{
        values.forEach(value => {
            const result = this.NotNullOrUndefined(value);
            if(result.valid) return result;
        });
        return { valid: true};
    }

    public static GreaterThan(inValue: number | string, threeshold: number): ICheckerValidateSchema{
        let valueTested = typeof inValue === 'number' ? inValue : typeof inValue === 'string' ? inValue.length : null
        if( valueTested === null || !(valueTested > threeshold) ){
            return {
                valid: false,
                msg: `${inValue} is not greater than ${threeshold}`
            }
        }
        else if(valueTested > threeshold) 
            return{
                valid: true
            }
    }

    public static IsOne(value: any, values: any[], ): ICheckerValidateSchema{
        const isValid = values.includes(value);
        if(!isValid)
            return{
                valid: false,
                msg: `${value} not exist in ${JSON.stringify(values)}`
            }
        else{
            return{
                valid: true
            }
        }
    }

    public static InRange(value: number | string, min: number, max: number): ICheckerValidateSchema{
        let valueTested = typeof value === 'string' ? value.length : typeof value === 'number' ? value: null;
        if( valueTested === null || !(valueTested >= min && value <= max) ){
            return{
                valid: false,
                msg: `${value} not in the range: ${min}-${max} or value is null ${typeof value}`
            }
        }
        else if( valueTested !== null && (valueTested >= min && value <= max) ) return{
            valid: true
        }
        else{
            return {
                valid: false,
                msg: `${value} has a problem`
            }
        }
    }
    /**
     * @description  This expression tests negatively for all number cases, 
     * then all letter cases, and lastly tests for only alphanumeric characters in the required range.
     * In other words: the match must be alphanumeric with at least one number, 
     * one letter, and be between 6-15 character in length.
     * @param value 
     */
    public static IsAlphanumeric(value: string): ICheckerValidateSchema{        
        let alp = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/;
        if(!alp.test(value)){
            return {
                valid: false,
                msg: `${value} is not an Alphanumeric`
            }
        }
        else return{
            valid: true
        }
    }
}

export default Checker;