import { createClient } from "redis";
import RedisStore from "connect-redis";
import session from "express-session";
const redisClient = createClient({
    url: 'redis://localhost:6379',
});
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "dummy", //all keys stored with prefix
});
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.connect().catch(console.error);
//since sessionsMiddleware is mounted onto express, sessionId's are generated for each request
const sessionsOptions = {
    cookie: { maxAge: 7200000 * 2 }, //4hrs
    store: redisStore,
    saveUninitialized: false,
    resave: false,
    secret: 'keyboard cat', //signs the session ID cookie to prevent tampering.
};
const sessionsMiddleware = session(sessionsOptions);
export { redisClient, sessionsMiddleware };
