import sqlite3
from datetime import datetime

class DatabaseManager:
    def __init__(self, db_path='faq_chatbot.db'):
        self.db_path = db_path
    
    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    def sync_articles(self, articles):
        """Sync articles from Atlassian to local database"""
        conn = self.get_connection()
        c = conn.cursor()
        
        print(f"🔄 Syncing {len(articles)} articles to database...")
        
        for article in articles:
            try:
                # Use INSERT OR REPLACE (correct spelling)
                c.execute('''
                    INSERT OR REPLACE INTO faq_articles 
                    (article_id, title, content, url, last_updated)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    article['article_id'],
                    article['title'],
                    article['content'],
                    article['url'],
                    article['last_updated']
                ))
                print(f"   Synced: {article['title']}")
            except Exception as e:
                print(f"   Failed to sync '{article['title']}': {e}")
        
        conn.commit()
        conn.close()
        print(f" Successfully synced {len(articles)} articles to database")
    
    def search_articles(self, query, limit=5):
        # Search for relevant articles based on query
        conn = self.get_connection()
        c = conn.cursor()
        
        # Simple keyword search
        search_term = f'%{query}%'
        
        try:
            c.execute('''
                SELECT title, content, url 
                FROM faq_articles 
                WHERE title LIKE ? OR content LIKE ?
                LIMIT ?
            ''', (search_term, search_term, limit))
            
            results = c.fetchall()
            
            formatted_results = []
            for row in results:
                formatted_results.append({
                    'title': row[0], 
                    'content': row[1], 
                    'url': row[2]
                })
            
            return formatted_results
            
        except Exception as e:
            print(f" Search error: {e}")
            return []
        finally:
            conn.close()
    
    def save_chat(self, session_id, user_message, bot_response):
        # Save chat history
        conn = self.get_connection()
        c = conn.cursor()
        
        try:
            c.execute('''
                INSERT INTO chat_history (session_id, user_message, bot_response)
                VALUES (?, ?, ?)
            ''', (session_id, user_message, bot_response))
            
            conn.commit()
            print(f" Saved chat: {user_message[:50]}...")
        except Exception as e:
            print(f" Failed to save chat: {e}")
        finally:
            conn.close()