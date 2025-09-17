import { Request, Response, NextFunction } from "express";
import { redisClient } from "../configs/redis.config";
import  crypto  from "crypto";
import { CacheOptions } from '../interfaces/cache.interface';

export const MCache = (options: CacheOptions = {}) => {
    const {
        ttl = 300, // Default 5 menit
        keyPrefix = "api_cache",
        skipCacheIf,
        invalidateOnMethods = ["POST", "PUT", "DELETE", "PATCH"]
    } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (invalidateOnMethods.includes(req.method)) {
                return next();
            }

            if (skipCacheIf && skipCacheIf(req)) {
                return next();
            }

            const cacheKey = generateCacheKey(req, keyPrefix);
            const cachedData = await redisClient.get(cacheKey);

            if (cachedData) {
                const parsed = JSON.parse(cachedData);

                res.setHeader("X-Cache-Status", "HIT");
                res.setHeader("X-Cache-Key", cacheKey);

                console.log("parsed", parsed);
                console.log("typeof parsed", typeof parsed);

                return res.status(parsed.statusCode).json(parsed.data)
            }

        } catch (e) {
            
        }
    };
}