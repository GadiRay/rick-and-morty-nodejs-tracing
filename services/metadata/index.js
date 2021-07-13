const tracer = require('@nodejs-tracing/tracer')('metadata');
const { context, setSpan, SpanKind } = require('@opentelemetry/api');

const express = require('express');
const fetch = require('node-fetch');

const Logger = require('@nodejs-tracing/logger')('metadata');

const authorizationMiddleware = require('@nodejs-tracing/authorization');

const app = express();
const PORT = 3003;

const API_URL = 'https://rickandmortyapi.com/api/character';

app.use(authorizationMiddleware);

const getMetadata = async (req, res, next) => {
    Logger.log('start handling getMetadata');
    const { id } = req.params;
    const span = tracer.startSpan(`externalApiCall GET ${API_URL}/${id}`, {
        attributes: {
            'http.method': 'GET',
            'http.flavor': '1.1',
            'http.url': `${API_URL}/${id}`,
            'net.peer.ip': '127.0.0.1'
        },
        kind: SpanKind.CLIENT
    });

    context.with(setSpan(context.active(), span), async () => {
        span.addEvent('invoking extenal api call');
        const apiRes = await fetch(`${API_URL}/${id}`);
        const jsonRes = await apiRes.json();
        Logger.log('done handling getMetadata', { ...jsonRes });
        span.setAttribute('http.status_code', 200);
        span.end();
        return res.json(jsonRes);
    });
};

app.get('/api/v1/metadata/:id', getMetadata);

app.listen(PORT, (err) => {
    Logger.log(`server is listening on ${PORT}`);
});
