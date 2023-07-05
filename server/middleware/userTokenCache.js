const redis = require('redis')

const url = 'http://localhost:6379'

// const redisClient = redis.createClient({
//     url,
//     password: '',
//     socket: {
//         reconnectStrategy: (attempts) => {
//             const nextDelay = Math.min(2 ** attempts * 20, 30000)
//             logger.info(`Retry Redis connection attempt: ${attempts}, next attempt in: ${nextDelay}ms`)
//             return nextDelay
//         },
//     },
// })

const redisClient = redis.createClient({
    host: 'redis-stack',
    port: 6379
})

redisClient.connect();

redisClient.on("connect", () => {
    console.log("REDIS IS CONNECTED")
})

redisClient.on("error", (error) => {
    console.log("REDIS ERROR", error)
})

const getAsync = async (...args) => {
    const res = await redisClient.get(...args)

    return res
}
const setAsync = async (...args) => {
    await redisClient.set(...args)
}

const cacheUserToken = async (user) => {
    console.log("cacheUserToken")
    const userDetails = {
        tokenSet: user?.tokenSet
    }

    console.log(userDetails)

    await setAsync(`user:${user?.uuid}`, JSON.stringify(userDetails), 'EX', 60)

    return userDetails
}

const getCachedUserToken = async (userId) => {
    const serializedDetails = await getAsync(`user:${userId}`)
    return serializedDetails !== null ? JSON.parse(serializedDetails) : null
}

module.exports = {
    cacheUserToken,
    getCachedUserToken,
}
