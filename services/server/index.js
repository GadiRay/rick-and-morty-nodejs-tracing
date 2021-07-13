require('@nodejs-tracing/tracer')('server');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const Logger = require('@nodejs-tracing/logger')('server');

const authorizationMiddleware = require('@nodejs-tracing/authorization');

const initDb = require('./init_db');
const RedisClient = require('./redis_client');
const redisClient = new RedisClient();

const app = express();
const PORT = 3002;
const pool = initDb();

app.use(cors());
app.use(authorizationMiddleware);

const getAllCharacters = async (req, res, next) => {
    Logger.log('start handling getAllCharacters', { serviceName: 'rick-and-morty' });
    const query = 'SELECT * from characters';
    const { rows } = await pool.query(query);
    Logger.log('done handling getAllCharacters', { serviceName: 'rick-and-morty' });
    res.json(rows);
};

const getCharacter = async (req, res, next) => {
    Logger.log('start handling getCharacter');
    const { id: characterId } = req.params;
    const cacheRes = await redisClient.getAsync(characterId);
    if (cacheRes) {
        Logger.log('response from cache getCharacter', cacheRes);
        return res.json(cacheRes);
    }
    const query = 'SELECT * from characters WHERE id = $1';
    const {
        rows: [{ id, name }]
    } = await pool.query(query, [characterId]);
    const apiRes = await fetch(`http://localhost:3003/api/v1/metadata/${characterId}`, {
        headers: { authorization: 'Basic 12345' }
    });
    const { status, species, gender, image } = await apiRes.json();
    Logger.log('done handling getCharacter');
    const resultJson = { id, name, status, species, gender, image };
    await redisClient.setAsync(characterId, resultJson, 10);
    return res.json(resultJson);
};

app.get('/api/v1/characters', getAllCharacters);
app.get('/api/v1/characters/:id', getCharacter);

app.listen(PORT, (err) => {
    Logger.log(`server is listening on ${PORT}`);
});
