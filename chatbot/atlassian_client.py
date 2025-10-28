import requests
import os
from config import ATLASSIAN_CONFIG

class AtlassianClient:
    def __init__(self):
        self.base_url = ATLASSIAN_CONFIG['base_url']
        self.email = ATLASSIAN_CONFIG['email']
        self.api_token = ATLASSIAN_CONFIG['api_token']
        self.space_key = ATLASSIAN_CONFIG['space_key']

    def get_headers(self):
        return {
            'Content-Type' : 'application/json',
        }
    
    def get_auth(self):
        return (self.email, self.api_token)
    
    def get_articles(self, limit=100):
        # Fetch articles from Confluence space
        url = f"{self.base_url}/rest/api/content"
        params = {
            'spaceKey' : self.space_key,
            'limit' : limit,
            'expand' : 'body.view,version'
        }

        try:
            response = requests.get(
                url,
                params=params,
                auth=self.get_auth(),
                headers=self.get_headers()
            )
            response.raise_for_status()
            return response.json()['results']
        except requests.exceptions.RequestException as e:
            print(f"Error fetching articles {e}")
            return []
        
    def parse_article_content(self, article):
        # Extract relevant content from article
        return {
            'article_id' : article['id'],
            'title' : article['title'],
            'content' : article['body']['view']['value'] if 'body' in article else '',
            'url' : f"{self.base_url}{article['_links']['webui']}",
            'last_updated' : article['version']['when'] if 'version' in article else None
        }