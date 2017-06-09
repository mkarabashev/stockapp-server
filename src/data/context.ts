import * as redis from 'redis';

export interface IContext {
  client: redis.RedisClient
}

let client: redis.RedisClient | undefined;

export default async function makeContext(): Promise<IContext> {
  if(!client) {
    client = await redis.createClient(process.env.REDIS_URL, {
      retry_strategy: () => 3000
    });

    client.on('connect', () => console.log('Connected to Redis Server'));
    client.on('reconnecting', () => console.log('Reconnecting to Redis Server'));
  }

  return {
    client
  }
}
