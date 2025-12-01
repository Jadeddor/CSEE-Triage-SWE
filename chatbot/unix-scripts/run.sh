#!/bin/bash

echo "Starting FAQ chatbot..."

# activate conda
conda activate faq-chatbot

# start ollama if not running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "Starting Ollama..."
    ollama serve &
    sleep 10
fi

# start the flask app
echo "Starting Flask app..."
python app.py