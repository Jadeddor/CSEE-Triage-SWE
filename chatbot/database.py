import sqlite3
from datetime import datetime

class DatabaseManager:
    def __init__(self, db_path='faq_chatbot.db'):
        self.db_path = db_path
    
    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    def sync_articles(self, articles):
        # sync articles from atlassian to local db
        conn = self.get_connection()
        c = conn.cursor()

        for article in articles:
            c.execute('''
                INSERT OR REPLACEC INTO faq_articles
                (article_id, title, content, url, last_updated)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                article['article_id'],
                article['title'],
                article['content'],
                article['url'],
                article['last_updated']
            ))
        
        conn.commit()
        conn.close()

    def search_articles(self, query, limit=5):
        # search for relevant articles based on query
        conn = self.get_connection()
        c = conn.cursor()

        c.execute('''
            SELECT titel, content, url
            FROM faq_articles
            WHERE title LIKE ? OR content LIKE ?
            LIMIT ?          
        ''', (f'%{query}%', f'%{query}%', limit))

        results = c.fetchall()
        conn.close()

        return [{'title':row[0], 'content':row[1], 'url':row[2]} for row in results]
    
    def save_chat(self, session_id, user_message, bot_response):
        # save chat history
        conn = self.get_connection()
        c = conn.cursor()

        c.execute('''
            INSERT INTO chat_history (session_id, user_message, bot_response)
            VALUES (?, ?, ?)
        ''', (session_id, user_message, bot_response))

        conn.commit()
        conn.close()