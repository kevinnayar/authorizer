import { createClient, RedisClientType } from 'redis';

const redisClient: RedisClientType<any> = createClient();

redisClient.on('connect', () => console.log('🔌 Connected to Redis'));
redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

export async function getRedisClient(): Promise<RedisClientType<any>> {
  await redisClient.connect();
  return redisClient;
}
