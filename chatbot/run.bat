@echo off
echo Starting FAQ chatbot...

REM activate conda env
call conda activate faq-chatbot

REM start ollama
start "Ollama server" /B ollama serve

REM wait for ollama to start
timeout /t 10 /nobreak >nul

REM start flask app
echo Starting Flask app...
python app.py

taskkill /f /im ollama.exe 2>nul
echo Ollama killed

pause