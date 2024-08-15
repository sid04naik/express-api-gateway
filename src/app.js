const express = require("express");
require("dotenv").config();
const { setupProxy } = require("./middlewares/proxy");
const middlewares = require("./middlewares");
const app = express();
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();

const registerMiddlewares = (app) => {
	// Dynamically register all middlewares
	Object.values(middlewares).forEach((middleware) => app.use(middleware));
};

registerMiddlewares(app);
// Proxy Setup
setupProxy(app);

collectDefaultMetrics({ register, timeout: 5000 });
// collectDefaultMetrics({register: client.register})

app.get("/metrics", async (req, res) => {
	try {
		res.setHeader("Content-Type", register.contentType);
		res.set("Content-Type", client.register.contentType);
		const metrics = await register.metrics();
		res.end(metrics);
	} catch (err) {
		res.status(500).end(err);
	}
});

module.exports = app;
