import express from 'express';
import monitor from 'express-status-monitor'
import bodyParser from 'body-parser';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import compression from "compression";
import morgan from "morgan";
import mongoose from 'mongoose';
import passport from 'passport';

import { AddressInfo } from 'net'
import { IEnvirementData } from './config/index';
import { Logger } from 'winston';
import InitiateDB from './config/databases';
import User from "./infrastructure/database/mongodb/UserModel";
import CreateUserController from './domain/useCases/CreateUserUseCase/CreateUserController';
import DeleteUserController from './domain/useCases/DeleteUserUseCase/DeleteUserController';
import CreateUserUseCase from './domain/useCases/CreateUserUseCase/CreateUserUseCase';
import UserRepository from './domain/repository/UserRepository';
import FacebookStrategyAuthenticate from './domain/services/facebookStrategy';

class AppStarter{
	private config: IEnvirementData;
	private logger: Logger;
	private dbify: InitiateDB;
	private cuc: CreateUserController;
	private duc: DeleteUserController;
	private userRepos: UserRepository;
	private FBStrategy;

	constructor({ configuration, getLogger, InitiateDb, 
		CreateUserController, DeleteUserController, UserRepos, 
		FacebookStrategyAuthenticate
		 }) {

		this.config = configuration;
		this.logger = getLogger.logger();	
		this.dbify = InitiateDb;
		this.cuc = CreateUserController;
		this.duc = DeleteUserController;
		this.userRepos = UserRepos;
		this.FBStrategy = FacebookStrategyAuthenticate;
	}
	
	public app_starter (){
		const app = express();		
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
		
		app.use(passport.initialize());
		
		this.dbify.configureDbAndLoad();

		app.get('/', (req, res) => {
			res.status(200).json({
				host: req.host,
				headers: req.headers
			})
		})
		app.post('/post', async (req, res) => this.cuc.lunch(req, res))
		app.delete('/delete', async (req, res) => this.duc.lunch(req, res))
		this.FBStrategy.Authenticate(app);
		console.log('fb startegy ...........')
		const serverPort = this.config.serverPort;
		const serverHttpsPort = this.config.serverHttpsPort;


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
			}),
			startHttps: () => new Promise(resolve => {
				https.createServer({
					key: fs.readFileSync('./src/infrastructure/encryption/certificates/server.key'),
					cert: fs.readFileSync('./src/infrastructure/encryption/certificates/server.crt'),
				}, app).listen(serverHttpsPort, () => {
					const { prototype } = https.Server
					console.log('https connection: ',prototype.connections);
				} )
			})
		})		
	}
}


export default AppStarter;