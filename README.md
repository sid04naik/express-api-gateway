# Express API Gateway

A fully-featured Express.js API Gateway designed for microservices architecture with comprehensive monitoring, logging, and security features.

## 🚀 Features

- **Dynamic Proxy Routing**: YAML-based configuration for service routing
- **Request/Response Logging**: Structured logging with UUID tracking
- **Rate Limiting & Throttling**: Protection against abuse and DDoS
- **Security Middleware**: Helmet, CORS, and authentication support
- **Metrics Collection**: Prometheus metrics endpoint
- **Performance Monitoring**: K6 performance testing integration
- **Observability Stack**: Grafana, Loki, Prometheus, InfluxDB
- **Docker Support**: Complete containerized development environment

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

## 🛠️ Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sid04naik/express-api-gateway.git
   cd express-api-gateway
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the gateway**
   - Gateway: http://localhost:8002
   - Metrics: http://localhost:8002/metrics
   - Health Check: http://localhost:8002/

### Docker Development

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access services**
   - Gateway: http://localhost:8002
   - Nginx: http://localhost:80
   - Grafana: http://localhost:3000 (admin/admin)
   - Prometheus: http://localhost:9090
   - Loki: http://localhost:3100

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │───▶│  API Gateway    │───▶│  Microservices  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Observability  │
                       │     Stack       │
                       └─────────────────┘
```

### Core Components

- **Express Server**: Main application server
- **Middleware Stack**: Security, logging, rate limiting
- **Proxy Layer**: Dynamic routing to microservices
- **Observability**: Metrics, logging, and monitoring
- **Configuration**: YAML-based service configuration

## ⚙️ Configuration

### Service Routing

Configure your microservices in `config/gateway.yml`:

```yaml
http:
  - host: "host.docker.internal"
    api:
      v1:
        - service1:
            port: 9013
        - service2:
            port: 9014
```

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Core Application
NODE_ENV=dev
PORT=8002
NAME=express-api-gateway

# Nginx Configuration
NGINX_PORT=80
CONF_PATH=./config
LOG_PATH=./logs

# Redis
REDIS_PORT=6379

# Grafana
GRAFANA_PORT=3000
GRAFANA_PASSWORD=admin

# Loki
LOKI_PORT=3100

# Promtail
PRMOTAIL_PORT=9080

# Prometheus
PROMETHEUS_PORT=9090

# InfluxDB
INFLUXDB_PORT=8086
INFLUXDB_NAME=k6
INFLUXDB_USER=admin
INFLUXDB_PASSWORD=admin

# Data Paths
DATA_PATH=./data
```

## 🔧 Usage

### API Endpoints

- `GET /` - Health check and welcome message
- `GET /metrics` - Prometheus metrics endpoint
- `GET /ip` - Get client IP address
- `GET /api/v1/{service}/*` - Proxy to configured microservices

### Adding a New Service

1. **Deploy your microservice**
2. **Update `config/gateway.yml`**:
   ```yaml
   http:
     - host: "your-service-host"
       api:
         v1:
           - your-service:
               port: 8080
   ```
3. **Restart the gateway** (or use hot reload in development)

### Request Flow

1. Client sends request to gateway
2. Gateway assigns unique UUID for tracking
3. Security middleware validates request
4. Rate limiting checks apply
5. Request is logged with full context
6. Gateway routes to appropriate microservice
7. Response is logged and returned to client
8. Metrics are collected for monitoring

## 📊 Monitoring

### Available Dashboards

- **Node.js Metrics**: Application performance and health
- **K6 Performance Testing**: Load testing results
- **K6 Results**: Performance test analytics
- **Loggers**: Centralized log viewing

### Metrics

The gateway exposes Prometheus metrics at `/metrics` including:
- Request counts and durations
- Error rates
- Memory and CPU usage
- Custom business metrics

### Logging

Structured JSON logs are sent to Loki via Promtail:
- Request/response logging
- Error tracking
- Performance metrics
- Security events

## 🧪 Testing

### Unit Tests
```bash
npm test
npm run test:watch
npm run coverage
```

### Performance Tests
```bash
# Run K6 performance tests
npm run perf

# Run with dashboard
npm run perf:dashboard
```

### Code Quality
```bash
# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run prettier
```

## 🐳 Docker

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f server

# Stop services
docker-compose down
```

### Production
```bash
# Build image
docker build -t express-api-gateway .

# Run container
docker run -p 8002:8002 express-api-gateway
```

## 📁 Project Structure

```
express-api-gateway/
├── src/                    # Source code
│   ├── app.js             # Main application
│   ├── middlewares/       # Express middlewares
│   └── config/            # Configuration files
├── config/                # External configurations
│   ├── gateway.yml        # Service routing config
│   ├── nginx.conf         # Nginx configuration
│   ├── prometheus.yml     # Prometheus config
│   ├── loki.yaml          # Loki configuration
│   └── promtail.yaml      # Promtail configuration
├── bin/                   # Utility scripts
│   ├── nginx-gateway.js   # Nginx route generator
│   ├── nginx-routes.js    # Route configuration
│   └── createlog.sh       # Log creation script
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   └── performance/       # K6 performance tests
├── resources/             # Static resources
│   └── grafana-dashboards/ # Grafana dashboard configs
├── memory-bank/           # Project documentation
├── docker-compose.yml     # Service orchestration
├── Dockerfile             # Container definition
└── package.json           # Dependencies and scripts
```

## 🔒 Security

### Built-in Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Request Validation**: Input sanitization
- **UUID Tracking**: Request correlation

### Security Best Practices

- Use HTTPS in production
- Implement proper authentication
- Regular security updates
- Monitor for suspicious activity
- Validate all inputs

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Configure production settings
2. **SSL/TLS**: Set up HTTPS certificates
3. **Load Balancing**: Use Nginx or cloud load balancer
4. **Monitoring**: Configure alerting and dashboards
5. **Backup**: Set up configuration and data backups

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: express-api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: express-api-gateway
  template:
    metadata:
      labels:
        app: express-api-gateway
    spec:
      containers:
      - name: gateway
        image: express-api-gateway:latest
        ports:
        - containerPort: 8002
        env:
        - name: NODE_ENV
          value: "production"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the GNU License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/sid04naik/express-api-gateway/issues)
- **Documentation**: Check the `memory-bank/` directory for detailed project information
- **Discussions**: [GitHub Discussions](https://github.com/sid04naik/express-api-gateway/discussions)

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- Prometheus, Grafana, and Loki communities
- K6 team for performance testing tools
- All contributors and maintainers

---

**Built with ❤️ by [Siddhant Naik](https://github.com/sid04naik)**
