const { writeFileSync } = require('fs');
const { getSpan, context } = require('@opentelemetry/api');

module.exports = (serviceName) => {
    return {
        log: (message, extraData) => {
            const time = new Date().getTime();
            const traceId = getTraceId();
            writeFileSync('log.json', `${JSON.stringify({ time, traceId, message, serviceName, ...extraData })}\n`, {
                flag: 'a'
            });
        }
    };
};

function getTraceId() {
    const currentSpan = getSpan(context.active());
    return currentSpan?.context()?.traceId;
}
