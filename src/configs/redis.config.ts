import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || 'redist://localhost:6379'

const redisClient = createClient({
    url: REDIS_URL
});

redisClient.on('error', (err) => {
    console.log('Redis Client Error: ', err);
});

const connectRedis = async (): Promise<void> => {
    await redisClient.connect();
    console.log('Redis connected successfully');
};

export {redisClient, connectRedis};

export const publishQueueUpdate = async (data: any): Promise<void> => {
    await redisClient.publish('queue_updates', JSON.stringify(data));
};
