# Microservices Architecture with Spring Boot

This project demonstrates a complete microservices architecture using Spring Boot with Eureka, API Gateway, Feign Client, and Load Balancing.

## Architecture Overview

```
┌─────────────────┐
│   API Gateway   │ (Port 8080)
│   JWT Filter    │
└────────┬────────┘
         │
         ├──────────────┬─────────────┐
         │              │             │
    ┌────▼─────┐   ┌───▼────┐   ┌───▼────────┐
    │  Eureka  │   │  User  │   │   Note     │
    │  Server  │   │ Service│   │  Service   │
    │ (8761)   │   │ (8081) │   │  (8082)    │
    └──────────┘   └───┬────┘   └─────┬──────┘
                       │              │
                       ▼              ▼
                   PostgreSQL     PostgreSQL
                   (users db)     (notes db)
```

## Technology Stack

- **Spring Boot 3.1.5**
- **Spring Cloud 2022.0.4**
- **Eureka Server** - Service Discovery
- **Spring Cloud Gateway** - API Gateway with JWT authentication
- **OpenFeign** - Declarative REST client for inter-service communication
- **Spring Cloud LoadBalancer** - Client-side load balancing
- **PostgreSQL** - Database
- **Spring Security** - Authentication and authorization
- **JWT (JSON Web Tokens)** - Token-based authentication

## Services

### 1. Eureka Server (Port 8761)
- Service registry and discovery
- All microservices register here
- Dashboard: http://localhost:8761

### 2. API Gateway (Port 8080)
- Single entry point for all client requests
- Routes requests to appropriate microservices
- JWT token validation
- Load balancing across service instances

### 3. User Service (Port 8081)
- User management (CRUD operations)
- User registration and login
- JWT token generation
- PostgreSQL database: `users`

#### Features:
- Create user (Register)
- Login (JWT generation)
- Update user
- Delete user
- Get user by ID
- Get all users

### 4. Note Service (Port 8082)
- Note management (CRUD operations)
- Pin/unpin notes
- User validation via Feign client
- PostgreSQL database: `notes`

#### Features:
- Create note
- Update note
- Delete note
- Get note by ID
- Get all notes
- Get notes by user ID
- Get pinned notes
- Toggle pin/unpin

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- Git

## Database Setup

1. Install PostgreSQL if not already installed

2. Create databases:
```sql
CREATE DATABASE users;
CREATE DATABASE notes;
```

3. The application will automatically create tables on startup (using `ddl-auto: update`)

## Installation & Running

### Step 1: Clone the repository
```bash
cd C:\Project\MicroServices
```

### Step 2: Start services in order

#### 1. Start Eureka Server (First)
```bash
cd eureka-server
mvn clean install
mvn spring-boot:run
```
Wait for Eureka to start completely (check http://localhost:8761)

#### 2. Start User Service
```bash
cd user-service
mvn clean install
mvn spring-boot:run
```

#### 3. Start Note Service
```bash
cd note-service
mvn clean install
mvn spring-boot:run
```

④ 4. Start API Gateway (Last)
```bash
cd api-gateway
mvn clean install
mvn spring-boot:run
```

### Verify All Services
Visit http://localhost:8761 - you should see:
- API-GATEWAY
- USER-SERVICE
- NOTE-SERVICE

## API Endpoints

All requests go through API Gateway: `http://localhost:8080`

### User Service APIs

#### 1. Register User (No auth required)
```http
POST http://localhost:8080/api/users/register
Content-Type: application/json

{
    "username": "john_doe",
    "password": "password123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
}
```

#### 2. Login (No auth required)
```http
POST http://localhost:8080/api/users/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "password123"
}
```

Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "john_doe",
    "userId": 1
}
```

#### 3. Get User by ID (Auth required)
```http
GET http://localhost:8080/api/users/1
Authorization: Bearer <your-jwt-token>
```

#### 4. Get All Users (Auth required)
```http
GET http://localhost:8080/api/users
Authorization: Bearer <your-jwt-token>
```

#### 5. Update User (Auth required)
```http
PUT http://localhost:8080/api/users/1
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "email": "newemail@example.com",
    "firstName": "John",
    "lastName": "Updated"
}
```

#### 6. Delete User (Auth required)
```http
DELETE http://localhost:8080/api/users/1
Authorization: Bearer <your-jwt-token>
```

### Note Service APIs

#### 1. Create Note (Auth required)
```http
POST http://localhost:8080/api/notes/notes
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "userId": 1,
    "title": "My First Note",
    "content": "This is the content of my note",
    "pinned": false
}
```

#### 2. Get Note by ID (Auth required)
```http
GET http://localhost:8080/api/notes/notes/1
Authorization: Bearer <your-jwt-token>
```

#### 3. Get All Notes (Auth required)
```http
GET http://localhost:8080/api/notes/notes
Authorization: Bearer <your-jwt-token>
```

#### 4. Get Notes by User ID (Auth required)
```http
GET http://localhost:8080/api/notes/notes/user/1
Authorization: Bearer <your-jwt-token>
```

#### 5. Get Pinned Notes by User ID (Auth required)
```http
GET http://localhost:8080/api/notes/notes/user/1/pinned
Authorization: Bearer <your-jwt-token>
```

#### 6. Update Note (Auth required)
```http
PUT http://localhost:8080/api/notes/notes/1
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "title": "Updated Title",
    "content": "Updated content",
    "pinned": true
}
```

#### 7. Toggle Pin/Unpin (Auth required)
```http
PATCH http://localhost:8080/api/notes/notes/1/pin
Authorization: Bearer <your-jwt-token>
```

#### 8. Delete Note (Auth required)
```http
DELETE http://localhost:8080/api/notes/notes/1
Authorization: Bearer <your-jwt-token>
```

## Key Features Explained

### 1. **Eureka Server (Service Discovery)**
- **Location**: eureka-server
- **Purpose**: Acts as a service registry where all microservices register themselves
- **Usage**: Services can discover each other using service names instead of hardcoded URLs
- When a service starts, it registers with Eureka
- Services periodically send heartbeats to Eureka
- If a service goes down, Eureka removes it from the registry

### 2. **API Gateway**
- **Location**: api-gateway
- **Purpose**: Single entry point for all client requests
- **Features**:
  - **Routing**: Routes `/api/users/**` to User Service, `/api/notes/**` to Note Service
  - **Load Balancing**: Uses `lb://` protocol to load balance requests across multiple instances
  - **JWT Authentication**: Validates JWT tokens before forwarding requests
  - **Filter**: JwtAuthenticationFilter validates tokens for protected endpoints
  - Login and register endpoints bypass authentication

### 3. **Feign Client (Inter-service Communication)**
- **Location**: note-service/client/UserServiceClient.java
- **Purpose**: Note Service communicates with User Service
- **Usage**: When creating a note, Note Service validates that the user exists by calling User Service
- **Benefits**:
  - Declarative REST client
  - No need to write RestTemplate code
  - Automatic load balancing
  - Service discovery integration

### 4. **Load Balancer**
- **Location**: Configured in note-service and api-gateway
- **Purpose**: Distributes requests across multiple instances of the same service
- **How to test**:
  1. Start User Service on port 8081
  2. Start another instance: `mvn spring-boot:run -Dserver.port=8083`
  3. Both instances register with Eureka
  4. Requests are automatically distributed between them

### 5. **JWT Authentication**
- **Location**: user-service/security/JwtUtil.java & api-gateway/filter/JwtAuthenticationFilter.java
- **Flow**:
  1. User logs in via `/api/users/login`
  2. User Service validates credentials and generates JWT token
  3. Client includes token in `Authorization: Bearer <token>` header
  4. API Gateway validates token before forwarding request
  5. If valid, request proceeds to the target service

## Testing the Application

### Step 1: Register a User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"password\":\"test123\",\"email\":\"test@example.com\",\"firstName\":\"Test\",\"lastName\":\"User\"}"
```

### Step 2: Login
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"password\":\"test123\"}"
```

Save the token from the response.

### Step 3: Create a Note
```bash
curl -X POST http://localhost:8080/api/notes/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"userId\":1,\"title\":\"My Note\",\"content\":\"Note content\",\"pinned\":false}"
```

### Step 4: Get User's Notes
```bash
curl -X GET http://localhost:8080/api/notes/notes/user/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 5: Pin a Note
```bash
curl -X PATCH http://localhost:8080/api/notes/notes/1/pin \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

```
MicroServices/
├── eureka-server/
│   ├── src/main/java/com/microservices/eureka/
│   │   └── EurekaServerApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
├── api-gateway/
│   ├── src/main/java/com/microservices/gateway/
│   │   ├── ApiGatewayApplication.java
│   │   └── filter/
│   │       └── JwtAuthenticationFilter.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
├── user-service/
│   ├── src/main/java/com/microservices/userservice/
│   │   ├── UserServiceApplication.java
│   │   ├── entity/User.java
│   │   ├── repository/UserRepository.java
│   │   ├── service/UserService.java
│   │   ├── controller/UserController.java
│   │   ├── dto/
│   │   ├── security/JwtUtil.java
│   │   └── config/SecurityConfig.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
└── note-service/
    ├── src/main/java/com/microservices/noteservice/
    │   ├── NoteServiceApplication.java
    │   ├── entity/Note.java
    │   ├── repository/NoteRepository.java
    │   ├── service/NoteService.java
    │   ├── controller/NoteController.java
    │   ├── dto/
    │   └── client/UserServiceClient.java
    ├── src/main/resources/
    │   └── application.yml
    └── pom.xml
```

## Troubleshooting

### Services not registering with Eureka
- Ensure Eureka Server is running first
- Check `eureka.client.service-url.defaultZone` in application.yml
- Wait 30-60 seconds for registration to complete

### JWT Token errors
- Ensure SECRET_KEY is the same in User Service and API Gateway
- Check token expiration (default: 10 hours)
- Verify Bearer token format: `Authorization: Bearer <token>`

### Feign Client errors
- Ensure User Service is registered with Eureka
- Check service name in `@FeignClient(name = "user-service")`
- Verify User Service is running

### Database connection errors
- Verify PostgreSQL is running
- Check database names: `users` and `notes`
- Verify credentials in application.yml

### Port already in use
- Change port in application.yml
- Kill existing process: `netstat -ano | findstr :8081`

## Load Balancing Demo

To test load balancing:

1. Start User Service normally on port 8081
2. Start second instance:
```bash
cd user-service
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8083
```
3. Check Eureka Dashboard - both instances should be visible
4. Make multiple requests - they'll be distributed across instances

## Security Notes

- JWT tokens expire after 10 hours
- Passwords are encrypted using BCrypt
- Login and register endpoints are public
- All other endpoints require valid JWT token
- SECRET_KEY should be externalized in production (environment variable or config server)

## Future Enhancements

- [ ] Add Circuit Breaker (Resilience4j)
- [ ] Implement Spring Cloud Config Server
- [ ] Add distributed tracing (Sleuth + Zipkin)
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement pagination for list endpoints
- [ ] Add unit and integration tests
- [ ] Docker containerization
- [ ] Kubernetes deployment

## License

This project is for educational purposes.

## Author

Microservices Demo Project - 2026

