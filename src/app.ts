import express from 'express';
import monitor from 'express-status-monitor'
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from "compression";
import morgan from "morgan";
import { AddressInfo } from 'net'
import { IEnvirementData } from './config/index';
import { Logger } from 'winston';

class AppStarter{
	private config: IEnvirementData;
	private logger: Logger;
	constructor({ configuration, getLogger }){
		this.config = configuration;
		this.logger = getLogger.logger();	
	}
	public app_starter (){
		const app = express();
		// const { Configuration, AppLogger }  = container.cradle;
		
		// const configOrerror = Configuration.getConfig();
		// if(!configOrerror.isSuccess)						
		// 	console.log('[@ConfigurationError] configuration not loaded correctly');
		
		// this.config =  configOrerror.getValue() as IEnvirementData;

		if (this.config.env === 'development')
			app.use(monitor());
	
		app.disable('x-powerd-by');
		
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true}));
		app.use(helmet());
		app.use(compression());
		app.use(morgan('combined',{ stream: {
			write: (message) => { this.logger.info(message)}
		}}));
		app.get('/', (req, res, next) =>{
			this.logger.error({
				message: 'good working'
			});
			res.json({
				'cool': 'hello world'
			})
		})
		const serverPort = this.config.serverPort;

		return({
			app, 
			start: () =>  new Promise(resolve  => {				
				const http = app.listen(serverPort, () => {
					const { port } = http.address() as AddressInfo; 
					console.log('listen on ', port );
				})
			})
		})		
	}
}


export default AppStarter;