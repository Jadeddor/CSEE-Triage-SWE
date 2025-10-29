from config import ATLASSIAN_CONFIG, Config

print("Testing configuration...")
print(f"Base URL: {ATLASSIAN_CONFIG['base_url']}")
print(f"Email: {ATLASSIAN_CONFIG['email']}")
print(f"Space Key: {ATLASSIAN_CONFIG['space_key']}")
# Don't print the API token or secret key for security

print("✓ Configuration loaded successfully!")