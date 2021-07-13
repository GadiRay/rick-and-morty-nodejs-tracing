const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
    constructor() {
        this.client = redis.createClient('redis://localhost:6379');
        this.isClientReady = new Promise((resolve, reject) => {
            this.client.on('ready', () => {
                this.client.getAsync = promisify(this.client.get).bind(this.client);
                this.client.setAsync = promisify(this.client.set).bind(this.client);
                resolve();
            });

            this.client.on('error', (error) => {
                reject(error);
            });
        });
    }

    async getAsync(key) {
        await this.isClientReady;
        const result = await this.client.getAsync(key);
        return JSON.parse(result);
    }

    async setAsync(key, value, expiration = 60) {
        await this.isClientReady;
        return this.client.setAsync(key, JSON.stringify(value), 'EX', expiration);
    }
}
module.exports = RedisClient;
