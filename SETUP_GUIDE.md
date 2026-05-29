# Quick Setup Guide

## Prerequisites Installation

### 1. Install Java 17
Download from: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html

Verify installation:
```bash
java -version
```

### 2. Install Maven
Download from: https://maven.apache.org/download.cgi

Verify installation:
```bash
mvn -version
```

### 3. Install PostgreSQL
Download from: https://www.postgresql.org/download/

During installation:
- Set password for postgres user: `postgres`
- Remember the port: `5432`

## Database Setup

1. Open pgAdmin or psql command line

2. Connect to PostgreSQL:
```bash
psql -U postgres
```

3. Create databases:
```sql
CREATE DATABASE users;
CREATE DATABASE notes;
```

4. Verify:
```sql
\l
```

You should see both `users` and `notes` databases listed.

## Running the Application

### Option 1: Using PowerShell (Recommended for Windows)

Open 4 separate PowerShell windows:

**Window 1 - Eureka Server:**
```powershell
cd C:\Project\MicroServices\eureka-server
mvn clean install
mvn spring-boot:run
```

Wait until you see: "Started EurekaServerApplication"

**Window 2 - User Service:**
```powershell
cd C:\Project\MicroServices\user-service
mvn clean install
mvn spring-boot:run
```

Wait until you see: "Started UserServiceApplication"

**Window 3 - Note Service:**
```powershell
cd C:\Project\MicroServices\note-service
mvn clean install
mvn spring-boot:run
```

Wait until you see: "Started NoteServiceApplication"

**Window 4 - API Gateway:**
```powershell
cd C:\Project\MicroServices\api-gateway
mvn clean install
mvn spring-boot:run
```

Wait until you see: "Started ApiGatewayApplication"

### Option 2: Using start scripts

Create a file `start-all.bat`:
```batch
@echo off
echo Starting Eureka Server...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"
timeout /t 30

echo Starting User Service...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"
timeout /t 20

echo Starting Note Service...
start "Note Service" cmd /k "cd note-service && mvn spring-boot:run"
timeout /t 20

echo Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"

echo All services are starting...
```

Run:
```bash
start-all.bat
```

## Verification

### 1. Check Eureka Dashboard
Open browser: http://localhost:8761

You should see:
- API-GATEWAY
- USER-SERVICE
- NOTE-SERVICE

### 2. Test User Registration
```powershell
$body = @{
    username = "testuser"
    password = "test123"
    email = "test@example.com"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/users/register" -Method POST -Body $body -ContentType "application/json"
```

### 3. Test Login
```powershell
$body = @{
    username = "testuser"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/users/login" -Method POST -Body $body -ContentType "application/json"
$response.Content
```

Save the token from the response!

### 4. Test Create Note
```powershell
$token = "YOUR_TOKEN_HERE"  # Replace with actual token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    userId = 1
    title = "My First Note"
    content = "This is a test note"
    pinned = $false
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/notes/notes" -Method POST -Headers $headers -Body $body
```

## Common Issues & Solutions

### Issue: Port already in use
**Solution:**
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill process (replace PID with actual process ID)
taskkill /F /PID <PID>
```

### Issue: PostgreSQL connection refused
**Solution:**
1. Check PostgreSQL is running:
   - Open Services (Win + R, type `services.msc`)
   - Find "postgresql-x64-XX" service
   - Start if stopped

2. Verify connection:
```powershell
psql -U postgres -h localhost
```

### Issue: Services not registering with Eureka
**Solution:**
- Wait 30-60 seconds after service starts
- Check Eureka is running first
- Restart the service

### Issue: Maven build fails
**Solution:**
```powershell
# Clear Maven cache
mvn clean
Remove-Item -Recurse -Force ~/.m2/repository

# Rebuild
mvn clean install
```

### Issue: JWT token errors
**Solution:**
- Make sure you copied the entire token
- Check token hasn't expired (valid for 10 hours)
- Include "Bearer " prefix in Authorization header

## Testing with Postman

### Step 1: Import Collection

Create a new Postman collection with these requests:

1. **Register User** - POST http://localhost:8080/api/users/register
2. **Login** - POST http://localhost:8080/api/users/login
3. **Get Users** - GET http://localhost:8080/api/users
4. **Create Note** - POST http://localhost:8080/api/notes/notes
5. **Get Notes** - GET http://localhost:8080/api/notes/notes
6. **Pin Note** - PATCH http://localhost:8080/api/notes/notes/1/pin

### Step 2: Set Authorization

1. After login, copy the token
2. Go to Collection > Authorization
3. Type: Bearer Token
4. Token: Paste your token
5. All requests will use this token

## Stopping Services

Stop each service:
- Press `Ctrl + C` in each PowerShell window

OR stop all Java processes:
```powershell
Get-Process -Name "java" | Stop-Process -Force
```

## Next Steps

1. Read the main README.md for detailed API documentation
2. Check the architecture diagram
3. Explore the code structure
4. Try scaling services (run multiple instances)
5. Test load balancing

## Support

If you encounter issues:
1. Check logs in each service window
2. Verify all prerequisites are installed
3. Ensure PostgreSQL databases are created
4. Check Eureka dashboard for service registration
5. Verify port availability (8080, 8081, 8082, 8761)

Happy coding! 🚀

