const pinoLogger = require('pino');

const deploymentEnv = process.env.NODE_ENV || 'development';

const logger = (defaultConfig) =>
  pinoLogger({
    ...defaultConfig,
    level: deploymentEnv === 'production' ? 'info' : 'debug',
    serializers: {
      ...pinoLogger.stdSerializers,
      err: (e) => {
        const err = pinoLogger.stdSerializers.err(e);

        if (e.req) {
          err.req = pinoLogger.stdSerializers.req(e.req);
        }

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
