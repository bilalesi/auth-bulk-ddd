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
import InitiateDB from './config/databases';
import mongoose from 'mongoose'
import User from "./infrastructure/database/mongodb/UserModel";
import CreateUserController from './domain/useCases/CreateUserUseCase/CreateUserController';
import DeleteUserController from './domain/useCases/DeleteUserUseCase/DeleteUserController';

class AppStarter{
	private config: IEnvirementData;
	private logger: Logger;
	private dbify: InitiateDB;
	private cuc: CreateUserController;
	private duc: DeleteUserController;
	constructor({ configuration, getLogger, InitiateDb, CreateUserController, DeleteUserController }){
		this.config = configuration;
		this.logger = getLogger.logger();	
		this.dbify = InitiateDb;
		this.cuc = CreateUserController;
		this.duc = DeleteUserController;
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
		this.dbify.configureDbAndLoad();
		app.post('/post', async (req, res) => this.cuc.lunch(req, res))
		app.delete('/delete', async (req, res) => this.duc.lunch(req, res))


		const serverPort = this.config.serverPort;


		process.on('SIGINT', () => {
			mongoose.connection.close(() => {				
				process.exit(0)
			})
		}).on('SIGTERM', () => {
			mongoose.connection.close(() => {				
				process.exit(0)
			})
		})
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