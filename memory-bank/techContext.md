# Technical Context: Express API Gateway

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.19.2
- **Language**: JavaScript (CommonJS)
- **Containerization**: Docker & Docker Compose

### Key Dependencies

#### Production Dependencies
```json
{
  "express": "^4.19.2",           // Web framework
  "http-proxy-middleware": "^3.0.0", // Proxy functionality
  "helmet": "^7.1.0",             // Security headers
  "cors": "^2.8.5",               // CORS handling
  "compression": "^1.7.4",        // Response compression
  "express-rate-limit": "^7.4.0", // Rate limiting
  "express-slow-down": "^2.0.3",  // Request throttling
  "winston": "^3.14.1",           // Logging
  "winston-loki": "^6.1.2",       // Loki transport
  "prom-client": "^15.1.3",       // Prometheus metrics
  "js-yaml": "^4.1.0",            // YAML parsing
  "uuid": "^10.0.0",              // UUID generation
  "useragent": "^2.3.0",          // User agent parsing
  "dotenv": "^16.4.5"             // Environment variables
}
```

#### Development Dependencies
```json
{
  "jest": "^29.7.0",              // Testing framework
  "eslint": "^8.57.0",            // Code linting
  "prettier": "^3.3.3",           // Code formatting
  "nodemon": "^3.1.4",            // Development server
  "@faker-js/faker": "^8.4.1"     // Test data generation
}
```

### Observability Stack
- **Metrics**: Prometheus + Grafana
- **Logging**: Loki + Promtail
- **Performance Testing**: K6 + InfluxDB
- **Reverse Proxy**: Nginx

## Development Setup

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Environment Variables
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

### Project Structure
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
├── docker-compose.yml     # Service orchestration
├── Dockerfile             # Container definition
└── package.json           # Dependencies and scripts
```

## Technical Constraints

### Performance Constraints
- **Memory**: Optimized for containerized deployment
- **CPU**: Single-threaded Node.js event loop
- **Network**: HTTP/1.1 with proxy support
- **Concurrency**: Async/await pattern with Express

### Security Constraints
- **CORS**: Whitelist-based origin control
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Request Size**: 10MB limit for JSON and URL-encoded data
- **Headers**: Helmet security headers enforced

### Scalability Constraints
- **Horizontal Scaling**: Stateless design supports multiple instances
- **Load Balancing**: Nginx reverse proxy for distribution
- **Service Discovery**: Manual configuration via YAML
- **Caching**: Redis available but not integrated

### Monitoring Constraints
- **Metrics**: Prometheus format only
- **Logging**: JSON-structured logs required
- **Tracing**: UUID-based correlation only
- **Alerting**: External configuration required

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Docker Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f server

# Stop services
docker-compose down
```

### Testing Strategy
- **Unit Tests**: Jest framework for middleware and utilities
- **Integration Tests**: API endpoint testing
- **Performance Tests**: K6 load testing with InfluxDB
- **Coverage**: Jest coverage reporting

### Code Quality
- **Linting**: ESLint with Airbnb configuration
- **Formatting**: Prettier for consistent code style
- **Type Checking**: No TypeScript (JavaScript only)
- **Documentation**: JSDoc comments for functions

## Deployment Considerations

### Container Strategy
- **Multi-stage builds**: Not implemented
- **Health checks**: Basic endpoint monitoring
- **Resource limits**: Docker Compose defaults
- **Environment separation**: NODE_ENV variable

### Configuration Management
- **Environment-specific**: .env files for different environments
- **Service discovery**: Manual YAML configuration
- **Secrets**: Environment variables (no secret management)
- **Validation**: No configuration validation

### Monitoring Integration
- **Metrics endpoint**: `/metrics` for Prometheus scraping
- **Health endpoint**: Basic `/` endpoint
- **Log aggregation**: Winston → Loki via Promtail
- **Dashboard**: Pre-configured Grafana dashboards

## Known Limitations

### Current Limitations
1. **No Service Discovery**: Manual YAML configuration required
2. **No Circuit Breaker**: No fault tolerance patterns
3. **No Caching**: Redis available but not integrated
4. **No Authentication**: Basic auth middleware only
5. **No SSL/TLS**: HTTP only (Nginx handles HTTPS)

### Future Considerations
1. **Service Mesh Integration**: Istio/Consul compatibility
2. **API Documentation**: OpenAPI/Swagger integration
3. **GraphQL Support**: GraphQL proxy capabilities
4. **WebSocket Support**: Real-time communication
5. **Multi-tenancy**: Tenant isolation and routing
