import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('connect', () => console.log('🔌 Connected to Redis'));
redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

export async function getRedisClient() {
  await redisClient.connect();
  return redisClient;
}
