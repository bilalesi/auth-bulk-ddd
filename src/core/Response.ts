/**
 * the response class implemented for request response to the client
 * it recieve the configuration file as DI and make the success answer
 * and the failure response;
 */
import { assoc } from "ramda";
import { injectable, inject } from 'inversify'
import { IEnvirementData } from './../config';


export interface ISuccessResponse{
    success: boolean,
    date: Date,
    data: object
}

export interface IFailureResponse{
    success: boolean,
    date: Date,
    error: object
}


export interface IResponse {
    SuccessResponse: (data: any) => ISuccessResponse,
    FailedResponse: (error: any) => IFailureResponse
}

export default class Response implements IResponse{   
    private defaultResponse( success = true){
        return Object.assign({}, {
            success,
            date: new Date()
        })
    }

    public SuccessResponse(data: any): ISuccessResponse{
        return assoc('data', data, this.defaultResponse(true));
    }
    public FailedResponse(error: any): IFailureResponse{
        return assoc('error', error, this.defaultResponse(false));
    }
}