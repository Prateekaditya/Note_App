@echo off
echo ================================================
echo    Starting Microservices Application
echo    WITH CORS FIX Applied
echo ================================================
echo.

echo [1/5] Starting Eureka Server (Port 8761)...
start "Eureka Server - 8761" cmd /k "cd /d C:\Project\MicroServices\eureka-server && echo Starting Eureka Server... && mvn spring-boot:run"
echo     Waiting 35 seconds for Eureka to initialize...
timeout /t 35 /nobreak >nul

echo.
echo [2/5] Starting User Service (Port 8081) WITH CORS...
start "User Service - 8081" cmd /k "cd /d C:\Project\MicroServices\user-service && echo Starting User Service with CORS... && mvn spring-boot:run"
echo     Waiting 25 seconds for User Service...
timeout /t 25 /nobreak >nul

echo.
echo [3/5] Starting Note Service (Port 8082) WITH CORS...
start "Note Service - 8082" cmd /k "cd /d C:\Project\MicroServices\note-service && echo Starting Note Service with CORS... && mvn spring-boot:run"
echo     Waiting 25 seconds for Note Service...
timeout /t 25 /nobreak >nul

echo.
echo [4/5] Starting API Gateway (Port 8080) WITH CORS...
start "API Gateway - 8080" cmd /k "cd /d C:\Project\MicroServices\api-gateway && echo Starting API Gateway with CORS... && mvn spring-boot:run"
echo     Waiting 25 seconds for API Gateway...
timeout /t 25 /nobreak >nul

echo.
echo [5/5] Starting React Frontend (Port 3000)...
start "React Frontend - 3000" cmd /k "cd /d C:\Project\MicroServices\notes-frontend && echo Starting React Frontend... && npm start"

echo.
echo ================================================
echo    All services are starting!
echo ================================================
echo.
echo Service Windows:
echo   - Eureka Server - 8761
echo   - User Service - 8081
echo   - Note Service - 8082
echo   - API Gateway - 8080
echo   - React Frontend - 3000
echo.
echo Browser will open in ~30 seconds to http://localhost:3000
echo.
echo Check Eureka Dashboard: http://localhost:8761
echo.
echo ================================================

timeout /t 30 /nobreak >nul
start http://localhost:3000

echo.
echo Ready to test! Try registration now.
echo.
pause

