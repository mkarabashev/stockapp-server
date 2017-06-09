import * as redis from 'redis';

export interface IContext {
  client: redis.RedisClient
}

let client: redis.RedisClient | undefined;
const REDIS_PORT = parseInt(process.env.REDIS_PORT);
const REDIS_URL = process.env.REDIS_URL;

export default async function makeContext(): Promise<IContext> {
  if(!client) {
    client = await redis.createClient(REDIS_PORT, REDIS_URL, {
      retry_strategy: () => 3000
    });

    client.on('connect', () => console.log('Connected to Redis Server'));
    client.on('reconnecting', () => console.log('Reconnecting to Redis Server'));
  }

  return {
    client
  }
}
