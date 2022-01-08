const express = require('express');
const expressWinston = require('express-winston');

const { addRoutes } = require('./routes');

exports.createServer = function createServer({ logger }) {
  const api = express();

  // Log incoming requests
  api.use(expressWinston.logger({ meta: true, winstonInstance: logger }));

  // Assign a logger to the request object
  api.use((req, _res, next) => {
    req.logger = logger;
    next();
  });

  addRoutes(api);

  // Add an error handling logger
  api.use(expressWinston.errorLogger({ winstonInstance: logger }))

  return api;
}
