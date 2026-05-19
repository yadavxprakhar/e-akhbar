import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis';

// Create a distributed rate limiter backed by isolated Redis memory records
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minute window
    limit: 100, // Permit a maximum of 100 HTTP requests per client IP address
    standardHeaders: 'draft-7', // Draft-7 standard client indicators: RateLimit-* headers
    legacyHeaders: false, // Turn off X-RateLimit-* old indicators
    store: new RedisStore({
        // Route rate limiter commands directly through our active Redis client instance
        // @ts-ignore - redis library command signatures matching rate-limit-redis requirements
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
    message: {
        status: 429,
        error: 'Too Many Requests',
        message: 'You have exceeded the secure request threshold. Please try again after 15 minutes.'
    }
});
