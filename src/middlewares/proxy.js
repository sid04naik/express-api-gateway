const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const apiEndpoints = yaml.load(fs.readFileSync(path.resolve(__dirname, "../../config/gateway.yml"), "utf8"));

exports.setupProxy = (app) => {
	const http = apiEndpoints["http"];
	http.forEach((endpoints) => {
		const hostName = endpoints.host;
		const api = endpoints.api;
		for (let version in api) {
			api[version].forEach((ms) => {
				for (let name in ms) {
					const path = `/api/${version}/${name}`;
					const target = `http://${hostName}:${ms[name].port}${path}`;
					app.use(path, (req, res, next) => {
						createProxyMiddleware({
							target: target,
							changeOrigin: true,
							pathRewrite: { [`^${path}`]: "" },
							on: {
								proxyReq: (proxyReq, req, res) => {
									proxyReq.setHeader("uuid", req.uuid);
									if (req.body) {
										const bodyData = JSON.stringify(req.body);
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
							logger: req.logger,
						});
					});
				}
			});
		}
	});
};
