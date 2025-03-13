import Redis from 'ioredis';

class RedisServer {
    private redisClient: Redis;

    constructor() {
        this.redisClient = new Redis({
            port: 6379,
            host: 'localhost'
        });
    }

    async set(key: string, value: string, expiration: number) {
        await this.redisClient.set(key, value, 'EX', expiration);
    }

    async get(key: string) {
        return await this.redisClient.get(key);
    }

    async delete(key: string) {
        await this.redisClient.del(key);
    }
}

export default RedisServer;
