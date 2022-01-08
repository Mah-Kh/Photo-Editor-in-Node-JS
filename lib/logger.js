const winston = require('winston');

exports.createLogger = function createLogger(level) {
  return winston.createLogger({
    level,
    format: winston.format.simple(),
    transports: [new winston.transports.Console()]
  });
};
