@echo off

REM Set up npm packages and run Lite-server
echo Setting up npm packages...
npm install

REM Check if npm install was successful
if %errorlevel% neq 0 (
    echo Error: npm install failed. Exiting...
    exit /b
)

echo Starting Lite-server...
start /b "npm run lite-server"

REM Wait for Lite-server to start
timeout /t 5

REM Set up Python Flask server
echo Setting up Python Flask server...
cd ./flaskServer 

REM Install Python requirements
echo Installing Python requirements...
pip install -r requirements.txt

REM Check if pip install was successful
if %errorlevel% neq 0 (
    echo Error: pip install failed. Exiting...
    exit /b
)

REM Start Flask server
echo Starting Flask server...
python flaskServer.py
