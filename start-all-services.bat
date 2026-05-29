@echo off
echo ====================================
echo Starting Microservices Architecture
echo ====================================
echo.

echo [1/4] Starting Eureka Server...
start "Eureka Server - Port 8761" cmd /k "cd eureka-server && mvn spring-boot:run"
echo Waiting for Eureka Server to start (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo [2/4] Starting User Service...
start "User Service - Port 8081" cmd /k "cd user-service && mvn spring-boot:run"
echo Waiting for User Service to start (20 seconds)...
timeout /t 20 /nobreak >nul

echo.
echo [3/4] Starting Note Service...
start "Note Service - Port 8082" cmd /k "cd note-service && mvn spring-boot:run"
echo Waiting for Note Service to start (20 seconds)...
timeout /t 20 /nobreak >nul

echo.
echo [4/4] Starting API Gateway...
start "API Gateway - Port 8080" cmd /k "cd api-gateway && mvn spring-boot:run"

echo.
echo ====================================
echo All services are starting...
echo ====================================
echo.
echo Check service status:
echo - Eureka Dashboard: http://localhost:8761
echo - API Gateway:      http://localhost:8080
echo - User Service:     http://localhost:8081
echo - Note Service:     http://localhost:8082
echo.
echo Press any key to open Eureka Dashboard...
pause >nul
start http://localhost:8761

