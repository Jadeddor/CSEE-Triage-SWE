#!/bin/bash
echo "Initializing first time setup of FAQ chatbot..."

# create conda environment
echo "Creating conda environment..."
conda create -n faq-chatbot
cond activate faq-chatbot

# install dependencies
echo "Downloading dependencies..."
pip install flask requests python-dotenv sentence-transformers faiss-cpu numpy ollama

# install Ollama
echo "Downloading and installing Ollama..."
curl -fsSL https://ollama.ai/install.sh | sh

# pull the model
echo "Downloading LLM model... (this may take a few minutes)"
ollama pull llama3.1:8b

# init db
python models.py

echo "First time setup completed! Call ./run.sh to start the application."