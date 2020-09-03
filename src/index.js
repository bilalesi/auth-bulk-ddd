import container from './ioc_container';
const server = container.resolve('App');


async function start(){
    try{
        const ser = await server.app_starter();
        await ser.start();
    }catch(err){
        console.log('err', err)
    }
}


start();
