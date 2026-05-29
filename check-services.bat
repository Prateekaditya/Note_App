@echo off
echo ============================================
echo    Checking All Services Status
echo ============================================
echo.

echo [1/5] Checking Eureka Server (8761)...
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:8761' -TimeoutSec 3 -UseBasicParsing; Write-Host '  ✓ Eureka Server is UP' -ForegroundColor Green } catch { Write-Host '  ✗ Eureka Server is not responding' -ForegroundColor Red }"
echo.

echo [2/5] Checking User Service (8081)...
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:8081/actuator/health' -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue; Write-Host '  ✓ User Service is UP' -ForegroundColor Green } catch { Write-Host '  ✗ User Service is not responding' -ForegroundColor Red }"
echo.

echo [3/5] Checking Note Service (8082)...
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:8082/actuator/health' -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue; Write-Host '  ✓ Note Service is UP' -ForegroundColor Green } catch { Write-Host '  ✗ Note Service is not responding' -ForegroundColor Red }"
echo.

echo [4/5] Checking API Gateway (8080)...
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue; Write-Host '  ✓ API Gateway is UP' -ForegroundColor Green } catch { Write-Host '  ✗ API Gateway is not responding' -ForegroundColor Red }"
echo.

echo [5/5] Checking React Frontend (3000)...
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 3 -UseBasicParsing; Write-Host '  ✓ React Frontend is UP' -ForegroundColor Green } catch { Write-Host '  ✗ React Frontend is not responding' -ForegroundColor Red }"
echo.

echo ============================================
echo    Service URLs
echo ============================================
echo   Frontend:     http://localhost:3000
echo   Eureka:       http://localhost:8761
echo   API Gateway:  http://localhost:8080
echo ============================================
echo.

pause

