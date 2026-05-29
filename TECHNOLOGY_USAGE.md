# Technology Usage Summary

## Where Each Technology is Used

This document provides a detailed breakdown of where each mentioned technology is implemented in the project.

---

## 1. EUREKA SERVER (Service Discovery)

### 📍 Location: `eureka-server/`

### ✅ Used In:
- **Service:** Eureka Server
- **Port:** 8761
- **Dependency:** `spring-cloud-starter-netflix-eureka-server`

### 🔧 Implementation:
```java
// EurekaServerApplication.java
@SpringBootApplication
@EnableEurekaServer  // ← Enables Eureka Server
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

### ⚙️ Configuration:
```yaml
# application.yml
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    enable-self-preservation: false
```

### 📊 Purpose:
- Central registry for all microservices
- Service discovery and health monitoring
- Dashboard: http://localhost:8761

### 🎯 Services Registered:
- ✅ API Gateway (api-gateway)
- ✅ User Service (user-service)
- ✅ Note Service (note-service)

---

## 2. API GATEWAY (Spring Cloud Gateway)

### 📍 Location: `api-gateway/`

### ✅ Used In:
- **Service:** API Gateway
- **Port:** 8080
- **Dependency:** `spring-cloud-starter-gateway`

### 🔧 Implementation:
```java
// ApiGatewayApplication.java
@SpringBootApplication
@EnableDiscoveryClient  // ← Registers with Eureka
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```

### ⚙️ Configuration:
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service  # ← Load balanced routing
          predicates:
            - Path=/api/users/**
          filters:
            - JwtAuthenticationFilter  # ← JWT validation
```

### 📊 Features Implemented:
- ✅ Request routing to microservices
- ✅ JWT token validation
- ✅ Load balancing via Eureka (`lb://`)
- ✅ Path rewriting
- ✅ Custom filters (JwtAuthenticationFilter)

### 🎯 Routes:
- `/api/users/login` → User Service (no auth)
- `/api/users/register` → User Service (no auth)
- `/api/users/**` → User Service (auth required)
- `/api/notes/**` → Note Service (auth required)

---

## 3. FEIGN CLIENT (Declarative REST Client)

### 📍 Location: `note-service/client/UserServiceClient.java`

### ✅ Used In:
- **Service:** Note Service
- **Purpose:** Call User Service to validate users
- **Dependency:** `spring-cloud-starter-openfeign`

### 🔧 Implementation:
```java
// NoteServiceApplication.java
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients  // ← Enables Feign Clients
public class NoteServiceApplication {
    // ...
}

// UserServiceClient.java
@FeignClient(name = "user-service")  // ← Service name from Eureka
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    UserResponse getUserById(@PathVariable("id") Long id);
}
```

### 🔄 Usage in Code:
```java
// NoteService.java
@Autowired
private UserServiceClient userServiceClient;

public NoteResponse createNote(NoteRequest noteRequest) {
    // Validate user exists via Feign
    UserResponse user = userServiceClient.getUserById(noteRequest.getUserId());
    // ... create note
}
```

### 📊 How It Works:
1. Note Service needs to validate user exists
2. Calls `userServiceClient.getUserById(userId)`
3. Feign discovers User Service from Eureka
4. Makes HTTP GET request to User Service
5. Deserializes response to UserResponse
6. Returns result to Note Service

### 🎯 Integration Points:
- ✅ Service Discovery (finds user-service via Eureka)
- ✅ Load Balancing (if multiple User Service instances)
- ✅ Automatic serialization/deserialization
- ✅ Error handling and fallback (can be extended)

---

## 4. LOAD BALANCER (Client-Side Load Balancing)

### 📍 Location: Multiple services

### ✅ Used In:
- **Service:** API Gateway, Note Service
- **Dependency:** `spring-cloud-starter-loadbalancer`

### 🔧 Implementation:

#### In API Gateway:
```yaml
# application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service  # ← lb:// enables load balancing
```

#### In Note Service (Feign):
```yaml
# application.yml
spring:
  cloud:
    loadbalancer:
      ribbon:
        enabled: false  # Use Spring Cloud LoadBalancer
```

### 📊 How It Works:
1. Client requests `lb://user-service`
2. LoadBalancer queries Eureka for `user-service` instances
3. Eureka returns list of instances (e.g., 8081, 8083, 8084)
4. LoadBalancer selects instance using Round-Robin algorithm
5. Request sent to selected instance
6. Next request goes to different instance

### 🎯 Load Balancing Scenarios:

#### Scenario 1: API Gateway → User Service
```
Request 1: lb://user-service → 8081
Request 2: lb://user-service → 8083
Request 3: lb://user-service → 8081
Request 4: lb://user-service → 8083
```

#### Scenario 2: Note Service → User Service (Feign)
```
Note Service needs user validation
→ Feign calls lb://user-service
→ LoadBalancer distributes across instances
```

### 🧪 Testing Load Balancing:
```bash
# Start User Service instance 1
cd user-service
mvn spring-boot:run  # Port 8081

# Start User Service instance 2
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8083

# Start User Service instance 3
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8084

# All register with Eureka
# Requests automatically distributed across all instances
```

### ⚙️ Configuration:
```yaml
eureka:
  instance:
    prefer-ip-address: true
    instance-id: ${spring.application.name}:${server.port}
```

---

## 5. JWT (JSON Web Tokens) - Authentication

### 📍 Location: Multiple services

### ✅ Used In:
- **User Service:** Token generation
- **API Gateway:** Token validation
- **Dependency:** `jjwt-api`, `jjwt-impl`, `jjwt-jackson`

### 🔧 Implementation:

#### User Service (Token Generation):
```java
// JwtUtil.java
@Component
public class JwtUtil {
    private static final String SECRET_KEY = "MySecretKey...";
    private static final long EXPIRATION_TIME = 36000000; // 10 hours
    
    public String generateToken(String username, Long userId) {
        return Jwts.builder()
            .setClaims(Map.of("userId", userId))
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
}
```

#### API Gateway (Token Validation):
```java
// JwtAuthenticationFilter.java
@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory {
    private void validateToken(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
```

### 🔄 JWT Flow:
```
1. User logs in
   → POST /api/users/login
   → User Service validates credentials
   → Generates JWT token
   → Returns { token, username, userId }

2. Client stores token

3. Client makes authenticated request
   → Includes: Authorization: Bearer <token>
   → API Gateway validates token
   → If valid, forwards to service
   → If invalid, returns 401 Unauthorized
```

### 📊 Token Structure:
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "john_doe",
  "userId": 1,
  "iat": 1234567890,
  "exp": 1234603890
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

### 🎯 Protected Endpoints:
- ✅ `/api/users/**` (except login/register)
- ✅ `/api/notes/**` (all endpoints)

### ❌ Public Endpoints:
- `/api/users/login`
- `/api/users/register`

---

## 6. SPRING SECURITY - Password Encryption

### 📍 Location: `user-service/config/SecurityConfig.java`

### ✅ Used In:
- **Service:** User Service
- **Purpose:** Password encryption and endpoint security
- **Dependency:** `spring-boot-starter-security`

### 🔧 Implementation:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // ← BCrypt encryption
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/register").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .build();
    }
}
```

### 🔄 Usage:
```java
// UserService.java
@Autowired
private PasswordEncoder passwordEncoder;

// Register: Encrypt password
user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

// Login: Verify password
if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
    throw new RuntimeException("Invalid password");
}
```

### 🔒 Security Features:
- ✅ BCrypt password hashing (one-way encryption)
- ✅ Salt generation per password
- ✅ Configurable strength factor
- ✅ Stateless session (no server-side sessions)

---

## 7. POSTGRESQL DATABASE

### 📍 Location: External (localhost:5432)

### ✅ Used In:
- **User Service:** Database `users`
- **Note Service:** Database `notes`
- **Dependency:** `postgresql` driver

### ⚙️ Configuration:

#### User Service:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/users
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update  # Auto-create tables
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

#### Note Service:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/notes
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

### 📊 Database Tables:

#### Users Database:
```sql
Table: users
- id (BIGSERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE NOT NULL)
- password (VARCHAR NOT NULL)
- email (VARCHAR UNIQUE NOT NULL)
- first_name (VARCHAR)
- last_name (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Notes Database:
```sql
Table: notes
- id (BIGSERIAL PRIMARY KEY)
- user_id (BIGINT NOT NULL)
- title (VARCHAR NOT NULL)
- content (VARCHAR(2000))
- pinned (BOOLEAN DEFAULT false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 8. SPRING DATA JPA

### 📍 Location: All business services

### ✅ Used In:
- **User Service:** UserRepository
- **Note Service:** NoteRepository
- **Dependency:** `spring-boot-starter-data-jpa`

### 🔧 Implementation:

#### User Service:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
```

#### Note Service:
```java
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserId(Long userId);
    List<Note> findByUserIdAndPinned(Long userId, Boolean pinned);
}
```

### 📊 Features Used:
- ✅ CRUD operations (save, findById, findAll, delete)
- ✅ Custom query methods (findByUsername, findByUserId)
- ✅ Existence checks (existsByUsername, existsByEmail)
- ✅ Automatic query generation
- ✅ Entity lifecycle callbacks (@PrePersist, @PreUpdate)

---

## Technology Summary Table

| Technology | Service | Purpose | Port | Status |
|------------|---------|---------|------|--------|
| **Eureka Server** | eureka-server | Service Discovery | 8761 | ✅ Used |
| **API Gateway** | api-gateway | Routing & Auth | 8080 | ✅ Used |
| **Feign Client** | note-service | Inter-service calls | - | ✅ Used |
| **Load Balancer** | api-gateway, note-service | Load distribution | - | ✅ Used |
| **JWT** | user-service, api-gateway | Authentication | - | ✅ Used |
| **Spring Security** | user-service | Password encryption | - | ✅ Used |
| **PostgreSQL** | user-service, note-service | Data persistence | 5432 | ✅ Used |
| **Spring Data JPA** | user-service, note-service | Database access | - | ✅ Used |

---

## Verification Checklist

### ✅ Eureka Server
- [ ] All services visible in dashboard (http://localhost:8761)
- [ ] Services show as UP
- [ ] Heartbeats working

### ✅ API Gateway
- [ ] Routes requests to correct services
- [ ] JWT validation working
- [ ] Public endpoints accessible without token
- [ ] Protected endpoints require token

### ✅ Feign Client
- [ ] Note Service can call User Service
- [ ] User validation works when creating notes
- [ ] Error handling for non-existent users

### ✅ Load Balancer
- [ ] Multiple instances register with Eureka
- [ ] Requests distributed across instances
- [ ] Round-robin algorithm working

### ✅ JWT Authentication
- [ ] Login returns valid token
- [ ] Token accepted by protected endpoints
- [ ] Invalid token returns 401
- [ ] Token expiration working

### ✅ PostgreSQL
- [ ] Databases created (users, notes)
- [ ] Tables auto-created by JPA
- [ ] Data persisted correctly
- [ ] Queries working

---

## Quick Test Commands

```powershell
# 1. Test Eureka
Start-Process "http://localhost:8761"

# 2. Test Registration (No JWT needed)
$body = @{username="test";password="test123";email="test@test.com"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8080/api/users/register" -Method POST -Body $body -ContentType "application/json"

# 3. Test Login (Get JWT token)
$body = @{username="test";password="test123"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/users/login" -Method POST -Body $body -ContentType "application/json"
$token = ($response.Content | ConvertFrom-Json).token

# 4. Test Protected Endpoint (JWT required)
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Uri "http://localhost:8080/api/users" -Headers $headers

# 5. Test Feign Client (Create note - validates user via Feign)
$headers = @{Authorization="Bearer $token"; "Content-Type"="application/json"}
$body = @{userId=1;title="Test";content="Content";pinned=$false} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8080/api/notes/notes" -Method POST -Headers $headers -Body $body
```

---

**All technologies have been successfully implemented and integrated!** 🎉

