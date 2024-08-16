const { v7: uuidv7 } = require("uuid");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const auth = require("./auth");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const useragent = require("useragent");
const logger = require("../config/logger.config");
var CORSWhitelist = ["localhost"];
module.exports = {
  BodyParserJSON: bodyParser.json({ limit: "10mb" }),
  BodyParserURLEncoded: bodyParser.urlencoded({ extended: false, limit: "10mb" }),
  Helmet: helmet(),
  Compression: compression(),
  UUID: (req, res, next) => {
    req.uuid = req.headers.uuid || uuidv7();
    res.header("uuid", req.uuid);
    next();
  },
  CORS: cors((origin, cb) => {
    const options = {
      origin: !!CORSWhitelist.indexOf(origin),
    };
    cb(null, options);
  }),
  Request: (req, res, next) => {
    const postBody = Object.assign({}, req.body);
    if (postBody) {
      delete postBody.token;
      delete postBody.password;
      delete postBody.secret;
    }
    if (req.path !== "/metrics") {
      logger.info(
        JSON.stringify({
          type: "request",
          uuid: req.uuid,
          ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip,
          env: "local",
          method: req.method,
          useragent: useragent.parse(req.headers["user-agent"]),
          url: req.path,
          query: req.query,
          body: postBody,
          length: req.get("content-length"),
          ts: Date.now(),
        }),
      );
    }
    next();
  },
  Metrics: (req, res, next) => {
    res.on("finish", () => {
      if (req.path !== "/metrics") {
        logger.info(
          JSON.stringify({
            type: "metrics",
            uuid: req.uuid,
            env: "local",
            method: req.method,
            status: res.statusCode,
            url: req.path,
            length: res.get("content-length"),
            ts: Date.now(),
          }),
        );
      }
    });
    next();
  },
  RateLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
  }),
  SlowDown: slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests per 15 minutes, then start slowing down responses
    delayMs: (hits) => hits * 500, // slow down subsequent responses by 500ms per request
  }),
  Logger: (req, res, next) => {
    req["logger"] = {
      info: (message) =>
        logger.info(
          JSON.stringify({
            type: "info",
            uuid: req.uuid,
            env: "local",
            method: req.method,
            status: res.statusCode,
            url: req.path,
            length: res.get("content-length"),
            ts: Date.now(),
            message: message.trim(),
          }),
        ),
      warn: (message) =>
        logger.warn(
          JSON.stringify({
            type: "warn",
            uuid: req.uuid,
            env: "local",
            method: req.method,
            status: res.statusCode,
            url: req.path,
            length: res.get("content-length"),
            ts: Date.now(),
            message: message.trim(),
          }),
        ),
      error: (message) =>
        logger.error(
          JSON.stringify({
            type: "error",
            uuid: req.uuid,
            env: "local",
            method: req.method,
            status: res.statusCode,
            url: req.path,
            length: res.get("content-length"),
            ts: Date.now(),
            message: message.trim(),
          }),
        ),
    };
    next();
  },
};
