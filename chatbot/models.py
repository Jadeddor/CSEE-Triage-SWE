import sqlite3
from datetime import datetime

def init_db():
    conn = sqlite3.connect('faq_chatbot.db')
    c = conn.cursor()

    # creating table for FAQ articles
    c.execute('''
        CREATE TABLE IF NOT EXISTS faq_articles (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              article_id TEXT UNIQUE,
              title TEXT NOT NULL,
              content TEXT NOT NULL,
              url TEXT,
              category TEXT,
              last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              )
    ''')

    # chat history table
    c.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              session_id TEXT,
              user_message TEXT,
              bot_response TEXT,
              timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )          
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized.")