import express from 'express';
import monitor from 'express-status-monitor'
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from "compression";
import morgan from "morgan";
import { AddressInfo } from 'net'
import { IEnvirementData } from './config/index';
import container from './ioc_container';

require('dotenv').config();

class AppStarter{
	public config: IEnvirementData;
	async app_starter (){
		const app = express();
		const { Configuration }  = container.cradle;
		try {
			const configOrerror = await Configuration.getConfig();						
			this.config =  configOrerror.getValue() as IEnvirementData ;			
		} catch(err){
			console.log('[@ConfigurationError] configuration not loaded correctly', err);
		}
		if (this.config.env === 'development')
			app.use(monitor());
	
		app.disable('x-powerd-by');
		
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true}));
		app.use(helmet());
		app.use(compression());
		app.use(morgan('combined'));
		
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