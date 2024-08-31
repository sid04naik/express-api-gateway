const { createLogger, format, transports } = require("winston");
const LokiTransport = require("winston-loki");
const { combine, timestamp, json, colorize } = format;

// Custom format for console logging with colors
const customFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${timestamp} ${message}`;
  }),
);

// Console transport for all levels (error, warning, info)
const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(), // Adds colors to different log levels
    customFormat,
  ),
  level: "info", // Log levels (error, warn, info)
});

const lokiTransport = new LokiTransport({
  host: `http://${process.env.HOST}:${process.env.LOKI_PORT}`,
  labels: { job: "api-gateway", env: process.env.ENV },
  json: true,
  format: format.combine(format.colorize(), customFormat),
  gracefulShutdown: true, // Ensures logs are flushed before exit
  onConnectionError: (err) => console.error("Loki Connection Error:", err), // Log connection errors
});

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [consoleTransport, lokiTransport],
  exceptionHandlers: [new transports.Console({ format: customFormat })],
  rejectionHandlers: [new transports.Console({ format: customFormat })],
});

module.exports = logger;
