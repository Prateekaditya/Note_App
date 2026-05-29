# Microservices Architecture Documentation

## Overview
This document explains the architecture, design decisions, and implementation details of the microservices system.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Layer                            │
│                   (Web Browser / Mobile App)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                               │
│                        (Port 8080)                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  - Route Management                                        │ │
│  │  - JWT Token Validation (JwtAuthenticationFilter)          │ │
│  │  - Load Balancing (lb:// protocol)                         │ │
│  │  - Service Discovery Integration                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────┬────────────────────────────────┬───────────────┘
                 │                                 │
    ┌────────────▼──────────┐         ┌──────────▼────────────┐
    │   Eureka Server       │         │   Service Layer       │
    │   (Port 8761)         │         │                       │
    │  ───────────────      │         │                       │
    │  Service Registry     │◄────────┤                       │
    │  - Discovery          │         │                       │
    │  - Health Check       │         │                       │
    │  - Load Balancing     │         │                       │
    └───────────────────────┘         │                       │
                                      │                       │
                 ┌────────────────────┴──────────┐            │
                 │                                │            │
        ┌────────▼──────────┐          ┌────────▼──────────┐  │
        │   User Service    │          │   Note Service    │  │
        │   (Port 8081)     │          │   (Port 8082)     │  │
        │  ───────────────  │          │  ───────────────  │  │
        │  Business Logic:  │          │  Business Logic:  │  │
        │  - Registration   │          │  - Create Note    │  │
        │  - Login          │          │  - Update Note    │  │
        │  - JWT Generation │          │  - Delete Note    │  │
        │  - User CRUD      │◄─────────┤  - Pin/Unpin      │  │
        │                   │  Feign   │  - Get Notes      │  │
        │  Security:        │  Client  │                   │  │
        │  - BCrypt         │          │  Integration:     │  │
        │  - Spring Security│          │  - UserService    │  │
        └─────────┬─────────┘          │    Client (Feign) │  │
                  │                    └─────────┬─────────┘  │
                  │                              │             │
        ┌─────────▼─────────┐          ┌────────▼──────────┐  │
        │  PostgreSQL DB    │          │  PostgreSQL DB    │  │
        │   "users"         │          │   "notes"         │  │
        │  ───────────────  │          │  ───────────────  │  │
        │  Tables:          │          │  Tables:          │  │
        │  - users          │          │  - notes          │  │
        │                   │          │                   │  │
        │  Columns:         │          │  Columns:         │  │
        │  - id             │          │  - id             │  │
        │  - username       │          │  - user_id        │  │
        │  - password       │          │  - title          │  │
        │  - email          │          │  - content        │  │
        │  - first_name     │          │  - pinned         │  │
        │  - last_name      │          │  - created_at     │  │
        │  - created_at     │          │  - updated_at     │  │
        │  - updated_at     │          │                   │  │
        └───────────────────┘          └───────────────────┘  │
                                                               │
        ┌──────────────────────────────────────────────────────┘
        │
        │ Spring Cloud LoadBalancer
        │ (Client-side load balancing for multiple instances)
        │
        └─► Distributes requests across service instances
```

## Component Details

### 1. Eureka Server (Service Discovery)

**Purpose:** Central registry for all microservices

**Technology:** Netflix Eureka Server

**Key Features:**
- Service registration
- Service discovery
- Health monitoring
- Heartbeat mechanism
- Instance metadata storage

**Configuration:**
```yaml
eureka:
  client:
    register-with-eureka: false  # Eureka itself doesn't register
    fetch-registry: false
  server:
    enable-self-preservation: false  # Disabled for development
```

**How it works:**
1. Services register on startup with their metadata (name, host, port)
2. Services send heartbeats every 30 seconds
3. If heartbeat fails, service is marked as DOWN after 90 seconds
4. Client services fetch registry to discover other services
5. Registry is cached on client side and refreshed every 30 seconds

### 2. API Gateway

**Purpose:** Single entry point and routing layer

**Technology:** Spring Cloud Gateway

**Key Features:**
- Request routing based on path patterns
- JWT token validation
- Load balancing
- CORS handling
- Request/response filtering

**Routing Configuration:**
```yaml
spring:
  cloud:
    gateway:
      routes:
        # Public endpoints (no auth)
        - id: user-service-login
          uri: lb://user-service
          predicates:
            - Path=/api/users/login, /api/users/register
          
        # Protected endpoints (auth required)
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - JwtAuthenticationFilter
        
        - id: note-service
          uri: lb://note-service
          predicates:
            - Path=/api/notes/**
          filters:
            - JwtAuthenticationFilter
```

**Load Balancing:**
- Uses `lb://` protocol (LoadBalancer)
- Integrates with Eureka for service discovery
- Round-robin algorithm by default
- Client-side load balancing

**JWT Filter:**
```java
@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory {
    // Validates Authorization header
    // Extracts and validates JWT token
    // Returns 401 if invalid
    // Forwards request if valid
}
```

### 3. User Service

**Purpose:** User management and authentication

**Technology:** Spring Boot + Spring Security + JWT

**Database:** PostgreSQL (database: `users`)

**Key Features:**
- User registration with password encryption (BCrypt)
- Login with JWT token generation
- User CRUD operations
- Email and username uniqueness validation

**Security Layer:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Configures public endpoints: /login, /register
    // Stateless session management
    // BCrypt password encoding
}
```

**JWT Token:**
- **Algorithm:** HS256 (HMAC with SHA-256)
- **Secret Key:** Shared between User Service and API Gateway
- **Expiration:** 10 hours
- **Payload:** username, userId, issued at, expiration

**Token Structure:**
```json
{
  "sub": "john_doe",
  "userId": 1,
  "iat": 1234567890,
  "exp": 1234603890
}
```

**Endpoints:**
- `POST /login` - Authenticate and get token
- `POST /register` - Create new user
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### 4. Note Service

**Purpose:** Note management with user validation

**Technology:** Spring Boot + Spring Data JPA + Feign Client

**Database:** PostgreSQL (database: `notes`)

**Key Features:**
- Note CRUD operations
- Pin/unpin functionality
- User validation via Feign Client
- Association with users

**Feign Client Integration:**
```java
@FeignClient(name = "user-service")
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    UserResponse getUserById(@PathVariable("id") Long id);
}
```

**How Feign Works:**
1. Note Service declares interface with `@FeignClient`
2. Spring Cloud generates implementation at runtime
3. Feign uses Eureka to discover User Service
4. Load balances requests if multiple instances exist
5. Handles serialization/deserialization automatically

**User Validation Flow:**
```
1. Client creates note with userId
2. Note Service calls UserServiceClient.getUserById(userId)
3. Feign discovers User Service from Eureka
4. Feign makes HTTP request to User Service
5. If user exists, note is created
6. If user not found, error returned
```

**Endpoints:**
- `POST /notes` - Create note
- `GET /notes` - Get all notes
- `GET /notes/{id}` - Get note by ID
- `GET /notes/user/{userId}` - Get user's notes
- `GET /notes/user/{userId}/pinned` - Get pinned notes
- `PUT /notes/{id}` - Update note
- `PATCH /notes/{id}/pin` - Toggle pin status
- `DELETE /notes/{id}` - Delete note

### 5. Load Balancing

**Type:** Client-side load balancing

**Technology:** Spring Cloud LoadBalancer

**Configuration:**
```yaml
spring:
  cloud:
    loadbalancer:
      ribbon:
        enabled: false  # Use Spring Cloud LoadBalancer instead of Ribbon
```

**How it works:**
1. Client requests service by name (e.g., "user-service")
2. LoadBalancer fetches instances from Eureka
3. Selects instance using round-robin algorithm
4. Makes request to selected instance
5. If instance fails, retries with next instance

**Testing Load Balancing:**
```bash
# Start first instance on default port
cd user-service
mvn spring-boot:run

# Start second instance on different port
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8083

# Both register with Eureka
# Requests distributed 50/50 between them
```

## Request Flow Examples

### 1. User Registration Flow
```
Client
  │
  └──► POST /api/users/register
        │
        ▼
    API Gateway
        │ (No JWT filter for /register)
        ▼
    lb://user-service (Eureka lookup)
        │
        ▼
    User Service (8081)
        │ - Validate input
        │ - Check username/email uniqueness
        │ - Encrypt password with BCrypt
        │ - Save to PostgreSQL
        │
        ▼
    PostgreSQL (users DB)
        │
        └──► Return UserResponse
```

### 2. Login Flow
```
Client
  │
  └──► POST /api/users/login
        │
        ▼
    API Gateway
        │ (No JWT filter for /login)
        ▼
    lb://user-service (Eureka lookup)
        │
        ▼
    User Service (8081)
        │ - Find user by username
        │ - Verify password with BCrypt
        │ - Generate JWT token
        │
        └──► Return { token, username, userId }
```

### 3. Create Note Flow (with Feign Client)
```
Client
  │
  └──► POST /api/notes/notes
        │ Headers: Authorization: Bearer <token>
        ▼
    API Gateway
        │ - JwtAuthenticationFilter validates token
        │ - Extracts username from token
        ▼
    lb://note-service (Eureka lookup)
        │
        ▼
    Note Service (8082)
        │
        ├──► Feign Client Call
        │      │
        │      └──► GET lb://user-service/users/{userId}
        │             │
        │             ▼
        │         User Service (8081)
        │             │ - Find user by ID
        │             └──► Return UserResponse
        │
        │ - Validate user exists
        │ - Create note
        │ - Save to PostgreSQL
        │
        ▼
    PostgreSQL (notes DB)
        │
        └──► Return NoteResponse
```

### 4. Load Balanced Request Flow
```
Client
  │
  └──► POST /api/users/login
        │
        ▼
    API Gateway
        │
        └──► lb://user-service (lookup in Eureka)
               │
               ├──► Eureka returns:
               │    - user-service:8081 (UP)
               │    - user-service:8083 (UP)
               │
               └──► LoadBalancer selects instance
                     │ (Round-robin: alternates between instances)
                     │
                     ├──► Request 1 → user-service:8081
                     ├──► Request 2 → user-service:8083
                     └──► Request 3 → user-service:8081
```

## Design Patterns Used

### 1. API Gateway Pattern
- Single entry point for all client requests
- Centralized authentication and routing
- Reduces client complexity

### 2. Service Registry Pattern
- Dynamic service discovery
- Location transparency
- Automatic scaling support

### 3. Circuit Breaker Pattern (Future)
- Fault tolerance
- Graceful degradation
- Currently not implemented, but recommended for production

### 4. Client-Side Load Balancing
- Better performance than server-side LB
- Reduced latency
- No single point of failure

### 5. Database per Service
- Independent databases for each service
- Data isolation
- Independent scaling

### 6. Token-Based Authentication
- Stateless authentication
- Scalable across multiple instances
- No session storage needed

## Scalability

### Horizontal Scaling
Each service can be scaled independently:

**User Service:**
```bash
# Instance 1
mvn spring-boot:run

# Instance 2
mvn spring-boot:run -Dserver.port=8083

# Instance 3
mvn spring-boot:run -Dserver.port=8084
```
All instances register with Eureka and receive traffic

**Note Service:**
```bash
# Instance 1
mvn spring-boot:run

# Instance 2
mvn spring-boot:run -Dserver.port=8085
```

### Database Scaling
- PostgreSQL supports replication
- Read replicas for read-heavy workloads
- Sharding for write-heavy workloads

## Security Considerations

### Implemented:
- ✅ JWT token authentication
- ✅ Password encryption (BCrypt)
- ✅ HTTPS support (configurable)
- ✅ Public/private endpoint separation

### Recommended for Production:
- 🔲 Externalize SECRET_KEY to environment variable
- 🔲 Use Spring Cloud Config for centralized secrets
- 🔲 Implement refresh tokens
- 🔲 Add rate limiting
- 🔲 Enable CORS properly
- 🔲 Use HTTPS in production
- 🔲 Implement OAuth2 for third-party access
- 🔲 Add API versioning

## Monitoring & Observability

### Current State:
- Eureka Dashboard for service status
- Spring Boot Actuator endpoints (can be enabled)
- Console logging

### Recommended Additions:
- **Distributed Tracing:** Spring Cloud Sleuth + Zipkin
- **Metrics:** Micrometer + Prometheus
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Health Checks:** Spring Boot Actuator with custom health indicators
- **Alerting:** Prometheus Alertmanager

## Future Enhancements

1. **Configuration Server**
   - Centralized configuration management
   - Dynamic property updates
   - Environment-specific configs

2. **Circuit Breaker**
   - Resilience4j integration
   - Fallback mechanisms
   - Fault tolerance

3. **API Documentation**
   - Swagger/OpenAPI integration
   - Interactive API explorer

4. **Testing**
   - Unit tests with JUnit 5
   - Integration tests with TestContainers
   - Contract testing with Spring Cloud Contract

5. **Containerization**
   - Docker images for each service
   - Docker Compose for local development
   - Kubernetes deployment configs

6. **CI/CD**
   - GitHub Actions / Jenkins pipeline
   - Automated testing
   - Automated deployment

## Conclusion

This microservices architecture demonstrates modern cloud-native patterns and best practices. It's designed for scalability, maintainability, and resilience, making it suitable for both learning and as a foundation for production applications.

