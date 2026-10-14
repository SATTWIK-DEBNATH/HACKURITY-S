@echo off
setlocal enabledelayedexpansion

:: ==============================================================================
:: MCP SENTINEL (VERIAUTH-ZTA) — STRATEGIC TEST RUNNER & CAPABILITY HARNESS
:: Standards: NIST SP 800-207 Zero Trust | AWS Cedar PDP Engine | SHA-256 Merkle
:: ==============================================================================

title MCP Sentinel — Zero-Trust Security Test Runner

:: Locate Python executable (Virtual Environment preferred)
if exist "%~dp0.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%~dp0.venv\Scripts\python.exe"
) else (
    set "PYTHON_EXE=python"
)

:: If argument passed via CLI, execute directly without interactive prompt
if "%~1"=="--all" goto :RUN_ALL
if "%~1"=="-a" goto :RUN_ALL
if "%~1"=="1" goto :RUN_ALL
if "%~1"=="--cedar" goto :RUN_CEDAR
if "%~1"=="2" goto :RUN_CEDAR
if "%~1"=="--attacks" goto :RUN_ATTACKS
if "%~1"=="3" goto :RUN_ATTACKS
if "%~1"=="--hitl" goto :RUN_HITL
if "%~1"=="4" goto :RUN_HITL
if "%~1"=="--audit" goto :RUN_AUDIT
if "%~1"=="5" goto :RUN_AUDIT
if "%~1"=="--identity" goto :RUN_IDENTITY
if "%~1"=="6" goto :RUN_IDENTITY
if "%~1"=="--api" goto :RUN_API
if "%~1"=="7" goto :RUN_API
if "%~1"=="--build" goto :RUN_BUILD
if "%~1"=="8" goto :RUN_BUILD
if "%~1"=="--report" goto :RUN_REPORT
if "%~1"=="9" goto :RUN_REPORT
if "%~1"=="--start" goto :RUN_START
if "%~1"=="S" goto :RUN_START
if "%~1"=="s" goto :RUN_START

:MENU
cls
echo ===============================================================================
echo   __  __  ____ ____    ____  _____ _   _ _____ ___ _   _ _____ _     
echo  ^|  \/  ^|/ ___^|  _ \  / ___^|^| ____^| \ ^| ^|_   _^|_ _^| \ ^| ^| ____^| ^|    
echo  ^| ^|\/^| ^| ^|   ^| ^|_) ^| \___ \^|  _^| ^|  \^| ^| ^| ^|  ^| ^|^|  \^| ^|  _^| ^| ^|    
echo  ^| ^|  ^| ^| ^|___^|  __/   ___) ^| ^|___^| ^|\  ^| ^| ^|  ^| ^|^| ^|\  ^| ^|___^| ^|___ 
echo  ^|_^|  ^|_^|\____^|_^|     ^|____/^|_____^|_^| \_^| ^|_^| ^|___^|_^| \_^|_____^|_____^|
echo.
echo   CONTINUOUS ZERO-TRUST AUTHORIZATION HARNESS ^& CAPABILITY VERIFIER
echo   NIST SP 800-207 ^| AWS Cedar v3.2/v4.12 PDP ^| SHA-256 Merkle Ledger
echo ===============================================================================
echo.
echo   [1] Run All Zero-Trust Capability Tests (Complete Comprehensive Suite)
echo   [2] Test AWS Cedar Policy PDP Engine (Automated Reasoning AST)
echo   [3] Test Red-Team Attack Simulation Matrix (Prompt Injection, Sabotage)
echo   [4] Test Dual-Custody HITL Step-Up ^& Human Supervisor Gate
echo   [5] Verify Cryptographic SHA-256 Merkle Audit Chain ^& Anti-Tampering
echo   [6] Test Ephemeral Workload Identity (Agent-WID) ^& Capability Scopes
echo   [7] Test Live FastAPI Zero-Trust REST Endpoints
echo   [8] Run Frontend Production Build Check (Vite 8 + React 19)
echo   [9] Re-compile Executive Security Compliance Report (ReportLab PDF)
echo   [S] Start Full System Stack (Backend :8000 + Frontend :5173)
echo   [Q] Quit / Exit
echo.
echo ===============================================================================
set /p "CHOICE=Select an option [1-9, S, Q]: "

if "%CHOICE%"=="1" goto :RUN_ALL
if "%CHOICE%"=="2" goto :RUN_CEDAR
if "%CHOICE%"=="3" goto :RUN_ATTACKS
if "%CHOICE%"=="4" goto :RUN_HITL
if "%CHOICE%"=="5" goto :RUN_AUDIT
if "%CHOICE%"=="6" goto :RUN_IDENTITY
if "%CHOICE%"=="7" goto :RUN_API
if "%CHOICE%"=="8" goto :RUN_BUILD
if "%CHOICE%"=="9" goto :RUN_REPORT
if /i "%CHOICE%"=="S" goto :RUN_START
if /i "%CHOICE%"=="Q" goto :EXIT

echo [!] Invalid selection. Please enter a valid option.
timeout /t 2 >nul
goto :MENU

:RUN_ALL
echo.
echo [*] Executing Complete Zero-Trust Security Capability Suite...
"%PYTHON_EXE%" "%~dp0test_capability_suite.py" --all
set "ERR=%ERRORLEVEL%"
echo.
if "%~1"=="" pause
if "%ERR%"=="0" ( exit /b 0 ) else ( exit /b 1 )

:RUN_CEDAR
echo.
echo [*] Testing AWS Cedar Policy Engine ^& Formal AST Evaluation...
"%PYTHON_EXE%" "%~dp0test_capability_suite.py" --cedar
set "ERR=%ERRORLEVEL%"
echo.
if "%~1"=="" pause
if "%ERR%"=="0" ( exit /b 0 ) else ( exit /b 1 )

:RUN_ATTACKS
echo.
echo [*] Testing Controlled Red-Team Attack Simulation Matrix...
"%PYTHON_EXE%" "%~dp0test_capability_suite.py" --attacks
set "ERR=%ERRORLEVEL%"
echo.
if "%~1"=="" pause
if "%ERR%"=="0" ( exit /b 0 ) else ( exit /b 1 )

:RUN_HITL
echo.
echo [*] Testing Dual-Custody HITL Step-Up ^& Approval Gate...
"%PYTHON_EXE%" -c "from test_capability_suite import test_hitl_approval_gate; test_hitl_approval_gate()"
set "ERR=%ERRORLEVEL%"
echo.
if "%~1"=="" pause
if "%ERR%"=="0" ( exit /b 0 ) else ( exit /b 1 )

:RUN_AUDIT
echo.
echo [*] Verifying SHA-256 Merkle Audit Chain ^& Anti-Tampering Engine...
"%PYTHON_EXE%" "%~dp0test_capability_suite.py" --audit
set "ERR=%ERRORLEVEL%"
echo.
if "%~1"=="" pause
if "%ERR%"=="0" ( exit /b 0 ) else ( exit /b 1 )

:RUN_IDENTITY
echo.
echo [*] Testing Ephemeral Workload Identity (Agent-WID) ^& Scoped Tokens...
"%PYTHON_EXE%" "%~dp0test_capability_suite.py" --identity
set "ERR=%ERRORLEVEL%"
echo.
if "%~1"=="" pause
if "%ERR%"=="0" ( exit /b 0 ) else ( exit /b 1 )

:RUN_API
echo.
echo [*] Testing FastAPI Zero-Trust REST Endpoints...
"%PYTHON_EXE%" "%~dp0test_capability_suite.py" --api
set "ERR=%ERRORLEVEL%"
echo.
if "%~1"=="" pause
if "%ERR%"=="0" ( exit /b 0 ) else ( exit /b 1 )

:RUN_BUILD
echo.
echo [*] Running Frontend Production Build Verification (Vite 8)...
cd /d "%~dp0frontend"
call npm run build
set "ERR=%ERRORLEVEL%"
cd /d "%~dp0"
echo.
if "%ERR%"=="0" (
    echo [PASS] Frontend compiled cleanly with zero build errors!
) else (
    echo [FAIL] Frontend build failed with error code %ERR%!
)
echo.
if "%~1"=="" pause
if "%ERR%"=="0" ( exit /b 0 ) else ( exit /b 1 )

:RUN_REPORT
echo.
echo [*] Compiling Executive Security ^& Compliance Audit Report (PDF)...
"%PYTHON_EXE%" "%~dp0generate_pdf.py"
set "ERR=%ERRORLEVEL%"
echo.
if "%ERR%"=="0" (
    echo [PASS] Publication-quality report generated at SentinAgent_Continuous_Authorization_Report.pdf
)
echo.
if "%~1"=="" pause
if "%ERR%"=="0" ( exit /b 0 ) else ( exit /b 1 )

:RUN_START
echo.
echo ===============================================================================
echo [*] Launching MCP Sentinel Full Stack Environment:
echo     - Backend:  http://127.0.0.1:8000 (FastAPI + Cedar PDP)
echo     - Frontend: http://localhost:5173 (React 19 + Vite 8)
echo ===============================================================================
start "MCP Sentinel Backend" cmd /k "cd /d %~dp0 && %PYTHON_EXE% backend/run_backend.py"
start "MCP Sentinel Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo [!] Both servers launched in dedicated terminal windows!
echo.
if "%~1"=="" pause
goto :MENU

:EXIT
echo Exiting MCP Sentinel Test Harness. Goodbye.
exit /b 0
