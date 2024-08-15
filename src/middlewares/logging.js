const morgan = require("morgan");
const logger = require("../config/logger.config");
const useragent = require("useragent");

morgan.token("request", (req) => {
	const ua = useragent.parse(req.headers["user-agent"]);
	let postBody = Object.assign({}, req.body);
	if (postBody) {
		delete postBody.token;
		delete postBody.password;
		delete postBody.secret;
	}
	return JSON.stringify({
		type: "request",
		uuid: req.uuid,
		ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip,
		env: "local",
		// region: "india",
		// name: process.env.NAME,
		// user: req.User,
		method: req.method,
		useragent: ua,
		url: req.path,
		query: req.query,
		body: postBody,
		length: req.get("content-length"),
		ts: Date.now(),
	});
});

const morganFormat = ":request :method :url :status :response-time ms";

// const { createLogger, format, transports } = require('winston');
// const { combine, timestamp, json, colorize } = format;

exports.setupLogging = (app) => {
	// Setup Morgan to log HTTP requests using Winston
	app.use(
		morgan(morganFormat, {
			stream: {
				write: (message) => logger.info(message.trim()),
				// write: (message) => {
				//   const logObject = {
				//     request: message.split(" ")[0],
				//     method: message.split(" ")[1],
				//     url: message.split(" ")[2],
				//     status: message.split(" ")[3],
				//     responseTime: message.split(" ")[4],
				//   };
				//   logger.info(logObject);
				// },
			},
		}),
	);
};
