const express = require("express");
require("dotenv").config();
const { setupProxy } = require("./middlewares/proxy");
const middlewares = require("./middlewares");
const app = express();
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();

// Trust the reverse proxy
app.set("trust proxy", "127.0.0.1");
Object.values(middlewares).forEach((middleware) => app.use(middleware));
// Proxy Setup
setupProxy(app);
collectDefaultMetrics({ register, timeout: 5000 });
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

app.get("/ip", (req, res) => {
  let ip = req.ip;
  const ipv6Prefix = "::ffff:";
  if (ip.startsWith(ipv6Prefix)) {
    ip = ip.substring(ipv6Prefix.length);
  }
  res.send({ ip: ip });
});
app.get("/", (req, res) => {
  res.send("Welcome to Express API Gateway");
});

module.exports = app;
