const pinoLogger = require('pino');

const deploymentEnv = process.env.NODE_ENV || 'development';

const logger = (defaultConfig) =>
  pinoLogger({
    ...defaultConfig,
    ...(deploymentEnv !== 'production' && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    }),
    level: deploymentEnv === 'production' ? 'info' : 'debug',
    serializers: {
      ...pinoLogger.stdSerializers,
      err: (e) => {
        const err = pinoLogger.stdSerializers.err(e);

        if (e.req) {
          err.req = pinoLogger.stdSerializers.req(e.req);
        }

        // Convert stack to an array to help with readability when parsed.
        err.stack = err?.stack.split(/\n\s*/g);

        return err;
      }
    },
    timestamp: pinoLogger.stdTimeFunctions.isoTime,
    redact: [
      'cookie',
      'cookies',
      'req.cookie',
      'req.cookies',
      'req.*.cookie',
      'req.*.cookies'
    ]
  });

module.exports = {
  logger
};
