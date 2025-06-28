# System Patterns: Express API Gateway

## Architecture Overview

### High-Level Architecture
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

### Component Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Express API Gateway                      │
├─────────────────────────────────────────────────────────────┤
│  Middleware Stack (src/middlewares/)                        │
│  ├─ UUID Generation                                         │
│  ├─ CORS Handling                                           │
│  ├─ Security (Helmet)                                       │
│  ├─ Compression                                             │
│  ├─ Rate Limiting                                           │
│  ├─ Request Logging                                         │
│  ├─ Response Logging                                        │
│  └─ Error Handling                                          │
├─────────────────────────────────────────────────────────────┤
│  Proxy Layer (src/middlewares/proxy.js)                     │
│  ├─ YAML Configuration Parser                               │
│  ├─ Dynamic Route Creation                                  │
│  └─ HTTP Proxy Middleware                                   │
├─────────────────────────────────────────────────────────────┤
│  Observability (config/)                                     │
│  ├─ Prometheus Metrics                                       │
│  ├─ Loki Logging                                            │
│  ├─ Grafana Dashboards                                      │
│  └─ K6 Performance Testing                                  │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. Middleware Pattern
**Purpose**: Modular request processing pipeline
**Implementation**: `src/middlewares/index.js`
```javascript
// Each middleware is a function that processes requests
Object.values(middlewares).forEach((middleware) => app.use(middleware));
```

**Benefits**:
- Modular and testable components
- Easy to add/remove functionality
- Clear separation of concerns

### 2. Configuration-Driven Routing
**Purpose**: Dynamic service discovery and routing
**Implementation**: `config/gateway.yml` + `src/middlewares/proxy.js`
```yaml
http:
  - host: "host.docker.internal"
    api:
      v1:
        - service1:
            port: 9013
```

**Benefits**:
- No code changes for new services
- Environment-specific configurations
- Version-based routing

### 3. Request Correlation Pattern
**Purpose**: Track requests across distributed systems
**Implementation**: UUID-based request tracking
```javascript
UUID: (req, res, next) => {
  req.uuid = req.headers.uuid || uuidv7();
  res.header("uuid", req.uuid);
  next();
}
```

**Benefits**:
- End-to-end request tracing
- Debugging across services
- Performance analysis

### 4. Structured Logging Pattern
**Purpose**: Consistent, searchable logging
**Implementation**: JSON-structured logs with Winston
```javascript
logger.info(JSON.stringify({
  type: "request",
  uuid: req.uuid,
  method: req.method,
  url: req.path,
  // ... other fields
}));
```

**Benefits**:
- Easy log aggregation
- Structured querying
- Performance monitoring

### 5. Metrics Collection Pattern
**Purpose**: Real-time performance monitoring
**Implementation**: Prometheus client integration
```javascript
collectDefaultMetrics({ register, timeout: 5000 });
app.get("/metrics", async (req, res) => {
  const metrics = await register.metrics();
  res.end(metrics);
});
```

**Benefits**:
- Standard metrics format
- Integration with monitoring tools
- Historical trend analysis

## Component Relationships

### Core Dependencies
```
app.js
├── middlewares/index.js
│   ├── auth.js
│   ├── logging.js
│   └── errorHandler.js
├── middlewares/proxy.js
│   └── config/gateway.yml
└── config/logger.config.js
```

### External Dependencies
```
Docker Compose Stack
├── Express API Gateway
├── Nginx (Reverse Proxy)
├── Redis (Caching)
├── Grafana (Visualization)
├── Loki (Log Aggregation)
├── Prometheus (Metrics)
└── InfluxDB (Time Series)
```

### Data Flow Patterns

#### Request Processing Flow
1. **Entry Point**: `index.js` → `src/app.js`
2. **Middleware Pipeline**: Sequential processing through all middlewares
3. **Proxy Routing**: Dynamic routing based on YAML configuration
4. **Service Call**: HTTP proxy to target microservice
5. **Response Processing**: Reverse flow through middleware
6. **Logging**: Structured logging at each step

#### Monitoring Data Flow
1. **Metrics Collection**: Prometheus client in Express app
2. **Log Aggregation**: Winston → Loki via Promtail
3. **Visualization**: Grafana dashboards
4. **Performance Testing**: K6 → InfluxDB

## Key Technical Decisions

### 1. Express.js Framework
**Rationale**: Mature, well-supported, middleware ecosystem
**Alternatives Considered**: Fastify, Koa
**Decision**: Express.js for stability and middleware support

### 2. YAML Configuration
**Rationale**: Human-readable, version-controllable configuration
**Alternatives Considered**: JSON, environment variables
**Decision**: YAML for readability and structure

### 3. UUID v7 for Request Tracking
**Rationale**: Time-ordered, globally unique identifiers
**Alternatives Considered**: UUID v4, custom correlation IDs
**Decision**: UUID v7 for time-ordering and uniqueness

### 4. Winston for Logging
**Rationale**: Flexible, transport-based logging
**Alternatives Considered**: Bunyan, Pino
**Decision**: Winston for Loki integration and flexibility

### 5. Docker Compose for Orchestration
**Rationale**: Simple, reproducible development environment
**Alternatives Considered**: Kubernetes, Docker Swarm
**Decision**: Docker Compose for simplicity and development focus
