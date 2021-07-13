'use strict';

const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { B3Propagator } = require('@opentelemetry/propagator-b3');

module.exports = (serviceName) => {
    // A lot of those plugins are automatically loaded when you install them
    // So if you do not use express for example you do not have to enable all
    // those plugins manually. But Express is not auto enabled so I had to add them
    // all
    const provider = new NodeTracerProvider();

    // Here is where I configured the exporter, setting the service name
    // and the jaeger host. The logger is helpful to track errors from the
    // exporter itself
    let exporter = new JaegerExporter({
        serviceName: serviceName
    });

    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

    provider.register({
        propagator: new B3Propagator()
    });

    registerInstrumentations({
        instrumentations: [
            {
                plugins: {
                    express: {
                        enabled: true,
                        path: '@opentelemetry/plugin-express'
                    },
                    http: {
                        enabled: true,
                        path: '@opentelemetry/plugin-http'
                    },
                    pg: {
                        enabled: true,
                        path: '@opentelemetry/plugin-pg'
                    },
                    redis: {
                        enabled: true,
                        path: '@opentelemetry/plugin-redis'
                    }
                }
            }
        ],
        tracerProvider: provider
    });
    // Set the global tracer so you can retrieve it from everywhere else in the
    // app
    return opentelemetry.trace.getTracer('example');
};
