@echo off
echo ============================================================
echo    MICROSERVICES STARTUP WITH HEALTH CHECKS
echo    Fixing "Backend Not Running" Issue
echo ============================================================
echo.

REM Start Eureka Server
echo [1/5] Starting Eureka Server (Port 8761)...
start "Eureka Server" cmd /k "cd /d C:\Project\MicroServices\eureka-server && mvn spring-boot:run"

echo Waiting 40 seconds for Eureka to fully start...
timeout /t 40 /nobreak >nul

REM Verify Eureka is running
echo Checking if Eureka is running...
powershell -Command "$response = try { Invoke-WebRequest -Uri 'http://localhost:8761' -TimeoutSec 5 -UseBasicParsing } catch { $null }; if ($response) { Write-Host 'SUCCESS: Eureka is running!' -ForegroundColor Green } else { Write-Host 'WARNING: Eureka may not be ready yet' -ForegroundColor Yellow }"
echo.

REM Start User Service
echo [2/5] Starting User Service (Port 8081)...
start "User Service" cmd /k "cd /d C:\Project\MicroServices\user-service && mvn spring-boot:run"

echo Waiting 30 seconds for User Service...
timeout /t 30 /nobreak >nul

REM Start Note Service
echo [3/5] Starting Note Service (Port 8082)...
start "Note Service" cmd /k "cd /d C:\Project\MicroServices\note-service && mvn spring-boot:run"

echo Waiting 30 seconds for Note Service...
timeout /t 30 /nobreak >nul

REM Start API Gateway
echo [4/5] Starting API Gateway (Port 8080)...
start "API Gateway" cmd /k "cd /d C:\Project\MicroServices\api-gateway && mvn spring-boot:run"

echo Waiting 35 seconds for API Gateway...
timeout /t 35 /nobreak >nul

REM Verify API Gateway is running
echo.
echo Checking if API Gateway is running...
powershell -Command "$response = try { Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -TimeoutSec 5 -UseBasicParsing } catch { $null }; if ($response) { Write-Host 'SUCCESS: API Gateway is running!' -ForegroundColor Green } else { Write-Host 'WARNING: API Gateway may not be ready yet, waiting 20 more seconds...' -ForegroundColor Yellow; Start-Sleep -Seconds 20 }"
echo.

REM Start React Frontend
echo [5/5] Starting React Frontend (Port 3000)...
start "React Frontend" cmd /k "cd /d C:\Project\MicroServices\notes-frontend && npm start"

echo.
echo ============================================================
echo    ALL SERVICES STARTED!
echo ============================================================
echo.
echo Service Windows (Check these for status):
echo   - Eureka Server (8761)
echo   - User Service (8081)
echo   - Note Service (8082)
echo   - API Gateway (8080)
echo   - React Frontend (3000)
echo.
echo Waiting 30 seconds for frontend to compile...
timeout /t 30 /nobreak >nul

echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo ============================================================
echo    READY!
echo ============================================================
echo.
echo Check Eureka Dashboard: http://localhost:8761
echo (Should show 3 registered services)
echo.
echo If frontend shows "backend not running":
echo   1. Wait 1 more minute for services to register
echo   2. Refresh the page (F5)
echo   3. Check API Gateway window for "Started" message
echo.
pause

