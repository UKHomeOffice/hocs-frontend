const redis = require('redis');

const redisClient = redis.createClient({
    host: 'redis-stack',
    port: 6379
});

redisClient.connect();

redisClient.on('connect', () => {
    console.log('Connected to redis');
});

redisClient.on('error', (error) => {
    console.log('Error connecting to redis', error);
});

const getAsync = async (...args) => {
    return await redisClient.get(...args);
};

const setAsync = async (...args) => {
    await redisClient.set(...args);
};

const cacheUserToken = async (user) => {
    const userDetails = {
        tokenSet: user?.tokenSet
    };

    await setAsync(`user:${user?.uuid}`, JSON.stringify(userDetails), 'EX', 60);

    return userDetails;
};

const getCachedUserToken = async (userId) => {
    const serializedDetails = await getAsync(`user:${userId}`);
    return serializedDetails !== null ? JSON.parse(serializedDetails) : null;
};

module.exports = {
    cacheUserToken,
    getCachedUserToken,
};
