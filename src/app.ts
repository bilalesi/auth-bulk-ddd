import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from "compression";
import morgan from "morgan";
import { AddressInfo } from 'net'

const getConfigState = async (configuration) => {
	const configOrerror = await configuration.getConfig();
	if(configOrerror.iSFailure)
		console.log('[@ConfigurationError] configuration not loaded mostly db error');

	return configOrerror.getValue();
}

const app_starter = async ({ configuration }) => {

	const app = express();
	app.disable('x-powerd-by');
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true}));
	app.use(helmet());
	app.use(compression());
	app.use(morgan('combined'));
	
	const config = await getConfigState(configuration);
	const serverPort = config.serverPort;

	return({
		app, 
		start: () => new Promise((resolve)=> {
			const http = app.listen(serverPort, () => {
				const { port } = http.address() as AddressInfo; 
				console.log('listen on ', port );
			})
		})
	})
}

export default app_starter;