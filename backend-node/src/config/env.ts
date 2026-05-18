import dotenv from 'dotenv';
import path from 'path';

// Load variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
    port: parseInt(process.env.PORT || '5000', 10),
    newsApiKey: process.env.NEWS_API_KEY || '',
    newsApiUrl: process.env.NEWS_API_URL || 'https://newsapi.org/v2',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    redisPassword: process.env.REDIS_PASSWORD || 'redisdbpwd',
    jwtSecret: process.env.JWT_SECRET || '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970',
    springServiceUrl: process.env.SPRING_SERVICE_URL || 'http://localhost:8082/api',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

// Check if external News API Token exists
if (!config.newsApiKey) {
    console.warn("WARNING: NEWS_API_KEY environment variable is not defined. The Gateway will gracefully use fallback mock data for news feeds.");
}
