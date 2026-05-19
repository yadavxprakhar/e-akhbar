import { createClient } from 'redis';
import { config } from './env';

// Initialize core Redis Client using environment configurations
export const redisClient = createClient({
    url: config.redisUrl,
    password: config.redisPassword
});

redisClient.on('connect', () => {
    console.log('✓ Successfully connected to isolated Redis cache memory cluster');
});

redisClient.on('error', (err) => {
    console.error('✗ Redis client connection failure occurred:', err);
});

/**
 * Connects the Redis client to the server.
 * This should be executed on server startup inside index.ts.
 */
export const connectRedis = async (): Promise<void> => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.error('✗ Failed to establish active connection with Redis cluster:', error);
        process.exit(1);
    }
};
