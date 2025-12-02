from config_a import ATLASSIAN_CONFIG
import requests
import os

class AtlassianClient:
    def __init__(self):
        self.base_url = ATLASSIAN_CONFIG['base_url'].rstrip('/')
        self.email = ATLASSIAN_CONFIG['email']
        self.api_token = ATLASSIAN_CONFIG['api_token']
        self.space_key = ATLASSIAN_CONFIG['space_key']
        
    def get_headers(self):
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    
    def get_auth(self):
        return (self.email, self.api_token)
    
    def test_connection(self):
        # Test basic connection to Confluence
        url = f"{self.base_url}/rest/api/space"
        print(f"Testing connection to: {url}")
        
        try:
            response = requests.get(
                url,
                auth=self.get_auth(),
                headers=self.get_headers(),
                timeout=30
            )
            print(f"Connection test status: {response.status_code}")
            
            if response.status_code == 200:
                spaces = response.json().get('results', [])
                space_keys = [space['key'] for space in spaces]
                print(f"Connection successful! Available spaces: {space_keys}")
                return True
            else:
                print(f"Connection failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"Connection test error: {e}")
            return False
    
    def get_articles(self, limit=100):
        # Fetch articles from Confluence space with detailed debugging
        url = f"{self.base_url}/rest/api/content"
        params = {
            'spaceKey': self.space_key,
            'type': 'page',
            'limit': limit,
            'expand': 'body.view,version,space'
        }
        
        print(f"\n=== DEBUG: Fetching articles ===")
        print(f"URL: {url}")
        print(f"Space Key: {self.space_key}")
        print(f"Email: {self.email}")
        print(f"Full request: {url}?spaceKey={self.space_key}&type=page")
        
        try:
            response = requests.get(
                url, 
                params=params, 
                auth=self.get_auth(),
                headers=self.get_headers(),
                timeout=30
            )
            
            print(f"Response status: {response.status_code}")
            
            if response.status_code == 401:
                print("401 Unauthorized - Check your email and API token")
                return []
            elif response.status_code == 403:
                print("403 Forbidden - Your account doesn't have access to this space")
                return []
            elif response.status_code == 404:
                print("404 Not Found - Possible issues:")
                print("   - Space key is incorrect")
                print("   - Base URL is wrong") 
                print("   - Your account doesn't have access to this space")
                print(f"   - Request URL was: {response.url}")
                return []
            
            response.raise_for_status()
            data = response.json()
            
            print(f"Success! Found {len(data['results'])} articles")
            
            if data['results']:
                print("Sample articles:")
                for article in data['results'][:3]:
                    print(f"  - {article['title']} (ID: {article['id']})")
            else:
                print("No articles found in this space")
                
            return data['results']
            
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response text: {e.response.text}")
            return []

    def parse_article_content(self, article):
        # Extract relevant content from article
        content = ""
        if 'body' in article and 'view' in article['body']:
            content = article['body']['view']['value']
        
        # Clean HTML tags
        import re
        clean_content = re.sub('<[^<]+?>', '', content)
        
        return {
            'article_id': article['id'],
            'title': article['title'],
            'content': clean_content,
            'url': f"{self.base_url}{article['_links']['webui']}",
            'last_updated': article['version']['when'] if 'version' in article else None
        }

# Debug script
if __name__ == '__main__':
    print("=== Testing Atlassian Connection ===")
    client = AtlassianClient()
    
    # Test connection first
    if client.test_connection():
        print("\n✅ Connection successful! Testing article fetch...")
        articles = client.get_articles(limit=5)
        if articles:
            print(f"\n Successfully fetched {len(articles)} articles!")
        else:
            print("\n No articles fetched. Check the error messages above.")
    else:
        print("\n Connection failed. Check your configuration.")