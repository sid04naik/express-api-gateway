const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services.config");
const logger = require("../config/logger.config");

exports.setupProxy = (app) => {
	services.forEach((service) => {
		app.use(
			service.path,
			createProxyMiddleware({
				target: `${service.target}${service.path}`, // Add the service.path,
				changeOrigin: true,
				pathRewrite: { [`^${service.path}`]: "" }, // Remove the service path from the URL
				on: {
					proxyReq: (proxyReq, req, res) => {
						proxyReq.setHeader("uuid", req.uuid);
						if (req.body) {
							const bodyData = JSON.stringify(req.body);
							// Properly set the content length and write the body data
							proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
							proxyReq.write(bodyData);
							proxyReq.end();
						}
					},
					proxyRes: (proxyRes, req, res) => {
						//response
					},
					error: (err, req, res) => {
						console.error("error", err);
					},
				},
				logger: logger,
			}),
		);
		logger.info(`${service.name} - ${service.target}`);
	});
};
