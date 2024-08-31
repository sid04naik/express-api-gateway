require("dotenv").config();
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const gatewayPath = path.resolve(__dirname, "../config/gateway.yml");
const filePath = path.join(__dirname, "../config/nginx.conf");
const apiEndpoints = yaml.load(fs.readFileSync(gatewayPath, "utf8"));
const http = apiEndpoints["http"];
const PORT = process.env.NGINX_PORT || 80;
const ENV = process.env.ENV || "production";
// Define the NGINX configuration as a string
let nginxConfig = `
worker_processes 1;

events {
    worker_connections 1024;
}

http {
    include mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;

    # Define the custom JSON format for error logs
    log_format json_error escape=json '{'
        '"timestamp": "$time_iso8601",'
        '"level": "error",'
        '"client": "$remote_addr",'
        '"host": "$host",'
        '"request": "$request",'
        '"status": "$status",'
        '"referrer": "$http_referer",'
        '"user_agent": "$http_user_agent",'
        '"service": "nginx",'
        '"environment": "${ENV}",'
        '"message": "Nginx Error"'
    '}';

    # Use the standard error log directive, as Nginx cannot format error logs with custom formats directly
    error_log /var/log/nginx/error.log warn;

    # Redirect the error logs to an access log file with the custom JSON format
    access_log /var/log/nginx/error.log json_error;

    # Access log configuration for reference
    log_format json_combined escape=json '{'
        '"timestamp": "$time_iso8601",'
        '"level": "info",'
        '"message": "Nginx Info",'
        '"ip": "$remote_addr",'
        '"method": "$request_method",'
        '"path": "$request_uri",'
        '"protocol": "$server_protocol",'
        '"status": $status,'
        '"response_size": $body_bytes_sent,'
        '"user_agent": "$http_user_agent",'
        '"service": "nginx",'
        '"environment": "${ENV}"'
    '}';

    access_log /var/log/nginx/access.log json_combined;
`;
http.forEach((endpoints) => {
  const hostName = endpoints.host;
  const gatewayPort = process.env.PORT || 8002;
  nginxConfig += `
    upstream backend {
      server ${hostName}:${gatewayPort};
    }

    server {
        listen ${PORT};
        server_name ${hostName};`;
  const path = `/`;
  const target = `http://backend`;
  nginxConfig += `
        location ${path} {
          proxy_pass ${target};
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS, PATCH, PUT, DELETE';
            add_header Access-Control-Allow-Headers 'Authorization, Content-Type';
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
          }
        }`;
  nginxConfig += `
      }
      include servers/*;
  }`;
});
// Write the NGINX config to the file
fs.writeFile(filePath, nginxConfig.trim(), (err) => {
  if (err) {
    console.error("Error writing nginx.conf:", err);
  } else {
    console.log("nginx.conf has been created successfully.");
  }
});
