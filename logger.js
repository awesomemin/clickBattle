const { createLogger, format, transports } = require('winston');

const userLogger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({ filename: 'userReq.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  userLogger.add(new transports.Console({ format: format.simple() }));
}

const univLogger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({ filename: 'univScore.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  univLogger.add(new transports.Console({ format: format.simple() }));
}

module.exports = {
  "userLogger": userLogger,
  "univLogger": univLogger
};