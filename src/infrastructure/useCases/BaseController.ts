import * as express from "express";

export abstract class BaseController{
    constructor(){}

    protected abstract run(req: express.Request, res: express.Response): Promise<void | any>;
    
    public async lunch(req: express.Request, res: express.Response): Promise<void | any>{
        console.log('++++++++++++++++++++ lunching start')
        try {
            await this.run(req, res);
        } catch (error) {
            this.fail500(res, error);            
        }
    }

    public ResponseAsJSON<T>(res: express.Response, code: number, body: T){
        return res.status(code).json(body);
    }

    public ok200<T>(res: express.Response, dto?: T){
        if(!!dto){
            res.type('application/json');
            return this.ResponseAsJSON<T>(res, 200, dto as T)
        }
        return res.sendStatus(200);
    }

    public fail400(res: express.Response, code: number, message?: string | object){
        return res.status(code).json({
            message
        })
    }
    
    public fail500(res: express.Response, error: Error | string){
        return res.status(500).json({
            message: error.toString()
        })
    }
}