#!/bin/bash
echo "Terminating FAQ chatbot..."
pkill -f "ollama serve"
pkill -f "python app.py"
echo "All services terminated."