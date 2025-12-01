@echo off
echo Terminating FAQ chatbot...
taskkill /f /im python.exe 2>nul
echo All services terminated.
pause