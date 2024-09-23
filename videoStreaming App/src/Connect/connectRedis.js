import { createClient } from 'redis';


const redisHost = process.env.REDIS_HOST; 
const redisPort = process.env.REDIS_PORT;       

const client = createClient({
  url: `redis://${redisHost}:${redisPort}`
});


client.on('connect',()=>{
    console.log(`Redis connected to ${redisHost}:${redisPort}`)
})
client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.connect();

export default client;
