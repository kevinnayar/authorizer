import dotenv from 'dotenv';
import { createClient, RedisClientType } from 'redis';

dotenv.config();

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const redisClient: RedisClientType<any> = createClient({
  url: `redis://default:${REDIS_PASSWORD!}@${REDIS_HOST!}:${REDIS_PORT!}`,
});

redisClient.on('connect', () => console.log('🔌 Connected to Redis'));
redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

export async function getRedisClient(): Promise<RedisClientType<any>> {
  await redisClient.connect();
  return redisClient;
}
