import container from './ioc_container';
require('dotenv').config();
const server = container.resolve('App');


server.app_starter().start();
