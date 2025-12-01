import os
from dotenv import load_dotenv

load_dotenv()

def get_required_env_var(var_name):
    value = os.getenv(var_name)
    if not value:
        raise ValueError(f"Required environment variable {var_name} is not set")
    return value

class Config:
    SECRET_KEY = get_required_env_var('SECRET_KEY')
    DATABASE = 'faq_chatbot.db'

ATLASSIAN_CONFIG = {
    'base_url' : get_required_env_var('ATLASSIAN_BASE_URL'),
    'email' : get_required_env_var('ATLASSIAN_EMAIL'),
    'api_token' : get_required_env_var('ATLASSIAN_API_TOKEN'),
    'space_key' : get_required_env_var('ATLASSIAN_SPACE_KEY'),
}

OLLAMA_CONFIG = {
    'base_url' : os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434'),
    'model' : os.getenv('OLLAMA_MODEL', 'llama3.1:8b')
}