# Project Summary

## 🎯 Project Overview

A complete **microservices architecture** built with Spring Boot demonstrating:
- Service Discovery (Eureka)
- API Gateway with JWT authentication
- Inter-service communication (Feign Client)
- Client-side Load Balancing
- Two business microservices (User & Note Management)

---

## 📁 Project Structure

```
C:\Project\MicroServices\
│
├── eureka-server/          # Service Discovery (Port 8761)
│   ├── src/main/java/
│   ├── src/main/resources/application.yml
│   └── pom.xml
│
├── api-gateway/            # API Gateway (Port 8080)
│   ├── src/main/java/
│   │   └── filter/JwtAuthenticationFilter.java
│   ├── src/main/resources/application.yml
│   └── pom.xml
│
├── user-service/           # User Management (Port 8081)
│   ├── src/main/java/
│   │   ├── entity/User.java
│   │   ├── repository/UserRepository.java
│   │   ├── service/UserService.java
│   │   ├── controller/UserController.java
│   │   ├── security/JwtUtil.java
│   │   └── config/SecurityConfig.java
│   ├── src/main/resources/application.yml
│   └── pom.xml
│
├── note-service/           # Note Management (Port 8082)
│   ├── src/main/java/
│   │   ├── entity/Note.java
│   │   ├── repository/NoteRepository.java
│   │   ├── service/NoteService.java
│   │   ├── controller/NoteController.java
│   │   └── client/UserServiceClient.java (Feign)
│   ├── src/main/resources/application.yml
│   └── pom.xml
│
├── README.md               # Main documentation
├── SETUP_GUIDE.md          # Quick setup instructions
├── API_DOCUMENTATION.md    # API endpoints reference
├── ARCHITECTURE.md         # Architecture details
├── TECHNOLOGY_USAGE.md     # Technology breakdown
├── database-setup.sql      # PostgreSQL setup script
└── start-all-services.bat  # Windows startup script
```

---

## 🚀 Services

### 1. Eureka Server (Port 8761)
- **Purpose:** Service registry and discovery
- **Technology:** Netflix Eureka
- **Access:** http://localhost:8761
- **Features:**
  - Service registration
  - Health monitoring
  - Service discovery

### 2. API Gateway (Port 8080)
- **Purpose:** Single entry point, routing, authentication
- **Technology:** Spring Cloud Gateway
- **Features:**
  - Request routing
  - JWT token validation
  - Load balancing (lb://)
  - Custom filters

### 3. User Service (Port 8081)
- **Purpose:** User management and authentication
- **Database:** PostgreSQL (`users`)
- **Features:**
  - User registration
  - Login with JWT
  - User CRUD operations
  - BCrypt password encryption

**Endpoints:**
```
POST   /api/users/register  (public)
POST   /api/users/login     (public)
GET    /api/users           (protected)
GET    /api/users/{id}      (protected)
PUT    /api/users/{id}      (protected)
DELETE /api/users/{id}      (protected)
```

### 4. Note Service (Port 8082)
- **Purpose:** Note management
- **Database:** PostgreSQL (`notes`)
- **Features:**
  - Note CRUD operations
  - Pin/unpin notes
  - User validation via Feign Client
  - Filter by user and pinned status

**Endpoints:**
```
POST   /api/notes/notes                (protected)
GET    /api/notes/notes                (protected)
GET    /api/notes/notes/{id}           (protected)
GET    /api/notes/notes/user/{userId}  (protected)
GET    /api/notes/notes/user/{userId}/pinned (protected)
PUT    /api/notes/notes/{id}           (protected)
PATCH  /api/notes/notes/{id}/pin       (protected)
DELETE /api/notes/notes/{id}           (protected)
```

---

## 🔧 Technologies Used

| Technology | Purpose | Location |
|------------|---------|----------|
| **Spring Boot 3.1.5** | Framework | All services |
| **Spring Cloud 2022.0.4** | Microservices | All services |
| **Eureka Server** | Service Discovery | eureka-server |
| **Spring Cloud Gateway** | API Gateway | api-gateway |
| **OpenFeign** | REST Client | note-service |
| **Spring Cloud LoadBalancer** | Load Balancing | api-gateway, note-service |
| **JWT (jjwt 0.11.5)** | Authentication | user-service, api-gateway |
| **Spring Security** | Security & BCrypt | user-service |
| **PostgreSQL** | Database | user-service, note-service |
| **Spring Data JPA** | ORM | user-service, note-service |
| **Lombok** | Boilerplate reduction | user-service, note-service |
| **Maven** | Build tool | All services |

---

## 📊 Architecture Diagram

```
                    Client (Browser/Postman)
                            │
                            ▼
                    ┌──────────────┐
                    │ API Gateway  │ (8080)
                    │ - Routing    │
                    │ - JWT Auth   │
                    │ - Load Bal.  │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌─────────┐    ┌────────────┐   ┌────────────┐
    │ Eureka  │    │   User     │   │   Note     │
    │ Server  │◄───┤  Service   │◄──┤  Service   │
    │ (8761)  │    │  (8081)    │   │  (8082)    │
    └─────────┘    └─────┬──────┘   └─────┬──────┘
                         │                │
                         ▼                ▼
                   PostgreSQL         PostgreSQL
                   (users DB)         (notes DB)
                   
                   ◄── Feign Client call
```

---

## ⚡ Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- PostgreSQL 12+

### Database Setup
```sql
CREATE DATABASE users;
CREATE DATABASE notes;
```

### Start Services (in order)
```powershell
# 1. Eureka Server
cd eureka-server
mvn spring-boot:run

# 2. User Service
cd user-service
mvn spring-boot:run

# 3. Note Service
cd note-service
mvn spring-boot:run

# 4. API Gateway
cd api-gateway
mvn spring-boot:run
```

**OR** use the startup script:
```powershell
.\start-all-services.bat
```

### Verify
- Eureka: http://localhost:8761
- All 3 services should be registered

---

## 🧪 Testing

### 1. Register User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"pass123","email":"john@test.com"}'
```

### 2. Login (Get JWT Token)
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"pass123"}'
```

Response:
```json
{
  "token": "eyJhbGc...",
  "username": "john",
  "userId": 1
}
```

### 3. Create Note (with JWT)
```bash
curl -X POST http://localhost:8080/api/notes/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"title":"My Note","content":"Content","pinned":false}'
```

### 4. Get User's Notes
```bash
curl -X GET http://localhost:8080/api/notes/notes/user/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Pin a Note
```bash
curl -X PATCH http://localhost:8080/api/notes/notes/1/pin \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Key Features Demonstrated

### ✅ Eureka Server
- Service registration
- Service discovery
- Health monitoring
- All services visible on dashboard

### ✅ API Gateway
- **Routing:** Routes to correct service based on path
- **JWT Validation:** Validates tokens before forwarding
- **Load Balancing:** Uses `lb://service-name` protocol
- **Path Rewriting:** Rewrites URLs for services

**Example Routes:**
```yaml
/api/users/login → lb://user-service (no auth)
/api/users/**    → lb://user-service (auth required)
/api/notes/**    → lb://note-service (auth required)
```

### ✅ Feign Client
- **Inter-service Communication:** Note Service → User Service
- **Purpose:** Validate user exists when creating note
- **Automatic:** Service discovery, load balancing, serialization

**Code:**
```java
@FeignClient(name = "user-service")
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    UserResponse getUserById(@PathVariable Long id);
}
```

### ✅ Load Balancer
- **Client-side:** Spring Cloud LoadBalancer
- **Algorithm:** Round-robin
- **Automatic:** Queries Eureka for instances

**Test:**
```bash
# Start multiple instances
mvn spring-boot:run  # 8081
mvn spring-boot:run -Dserver.port=8083  # 8083

# Requests distributed: 8081 → 8083 → 8081 → 8083
```

### ✅ JWT Authentication
- **Generation:** User Service (on login)
- **Validation:** API Gateway (before routing)
- **Algorithm:** HS256
- **Expiration:** 10 hours
- **Secret Key:** Shared between services

**Flow:**
```
Login → JWT Token → Include in requests → Gateway validates → Forward to service
```

---

## 📝 API Summary

### Public Endpoints (No JWT)
```
POST /api/users/register  - Register new user
POST /api/users/login     - Login and get JWT token
```

### Protected Endpoints (JWT Required)

**User Management:**
```
GET    /api/users         - Get all users
GET    /api/users/{id}    - Get user by ID
PUT    /api/users/{id}    - Update user
DELETE /api/users/{id}    - Delete user
```

**Note Management:**
```
POST   /api/notes/notes                - Create note
GET    /api/notes/notes                - Get all notes
GET    /api/notes/notes/{id}           - Get note by ID
GET    /api/notes/notes/user/{userId}  - Get user's notes
GET    /api/notes/notes/user/{userId}/pinned - Get pinned notes
PUT    /api/notes/notes/{id}           - Update note
PATCH  /api/notes/notes/{id}/pin       - Toggle pin
DELETE /api/notes/notes/{id}           - Delete note
```

---

## 📚 Documentation Files

1. **README.md** - Complete project documentation
2. **SETUP_GUIDE.md** - Step-by-step setup instructions
3. **API_DOCUMENTATION.md** - Detailed API reference
4. **ARCHITECTURE.md** - Architecture and design patterns
5. **TECHNOLOGY_USAGE.md** - Where each technology is used
6. **database-setup.sql** - PostgreSQL setup script
7. **PROJECT_SUMMARY.md** - This file
8. **start-all-services.bat** - Windows startup script

---

## 🔒 Security

- ✅ JWT token authentication
- ✅ BCrypt password encryption
- ✅ Stateless session management
- ✅ Public/protected endpoint separation
- ✅ Token expiration (10 hours)

---

## 📈 Scalability

### Horizontal Scaling
Each service can run multiple instances:

```bash
# User Service instances
mvn spring-boot:run                                    # 8081
mvn spring-boot:run -Dserver.port=8083                # 8083
mvn spring-boot:run -Dserver.port=8084                # 8084

# All register with Eureka
# Load balancer distributes requests
```

### Database per Service
- User Service → `users` database
- Note Service → `notes` database
- Independent scaling and maintenance

---

## 🎓 Learning Outcomes

This project demonstrates:

1. **Microservices Architecture** - Service decomposition
2. **Service Discovery** - Dynamic service location
3. **API Gateway Pattern** - Single entry point
4. **Inter-service Communication** - Feign client
5. **Load Balancing** - Client-side distribution
6. **Security** - JWT authentication
7. **Database per Service** - Data isolation
8. **Spring Cloud** - Complete ecosystem

---

## 🚀 Next Steps

Potential enhancements:
- Add Circuit Breaker (Resilience4j)
- Implement Spring Cloud Config
- Add distributed tracing (Sleuth + Zipkin)
- Containerize with Docker
- Deploy to Kubernetes
- Add API documentation (Swagger)
- Implement refresh tokens
- Add rate limiting

---

## ✅ Completion Status

### Core Requirements ✅
- [x] **Eureka Server** - Service discovery implemented
- [x] **API Gateway** - Routing and authentication
- [x] **Feign Client** - Note Service → User Service
- [x] **Load Balancer** - Client-side load balancing
- [x] **User Service** - Registration, login, CRUD, JWT
- [x] **Note Service** - Create, update, delete, pin notes
- [x] **PostgreSQL** - Database configuration
- [x] **JWT Authentication** - Token-based auth
- [x] **Documentation** - Complete guides

### Technologies Used ✅
- [x] Spring Boot 3.1.5
- [x] Spring Cloud 2022.0.4
- [x] Eureka Server
- [x] Spring Cloud Gateway
- [x] OpenFeign
- [x] Spring Cloud LoadBalancer
- [x] JWT (jjwt)
- [x] Spring Security
- [x] PostgreSQL
- [x] Spring Data JPA

---

## 📞 Support

Refer to these files for help:
- **Setup issues** → SETUP_GUIDE.md
- **API usage** → API_DOCUMENTATION.md
- **Architecture questions** → ARCHITECTURE.md
- **Technology details** → TECHNOLOGY_USAGE.md

---

## 🎉 Project Complete!

All microservices are fully functional with:
- ✅ Service Discovery (Eureka)
- ✅ API Gateway with JWT
- ✅ Load Balancing
- ✅ Feign Client
- ✅ User Management
- ✅ Note Management
- ✅ PostgreSQL Integration
- ✅ Complete Documentation

**Happy Coding! 🚀**

