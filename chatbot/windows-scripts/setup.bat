@echo off
echo Initializing first time setup of FAQ chatbot...

REM create conda env
echo Creating conda environment...
conda create -n faq-chatbot
call conda activate faq-chatbot

REM install python deps
echo Downloading dependencies...
pip install flask requests python-dotenv sentence-transformers faiss-cpu numpy ollama

echo Please download and install Ollama from:
echo https://ollama.ai/download
echo.
echo After installing, open a new terminal and run:
echo ollama pull llama3.1:8b
echo.

REM init db
python models.python

echo Setup complete!
echo Please remember to install Ollama and pull the correct model (llama3.1:8b)
echo Next steps:
echo 1. Start Ollama manually
echo 2. Run run.bat
pause