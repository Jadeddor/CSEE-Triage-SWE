import sqlite3
import os
from datetime import datetime

def init_db():
    conn = sqlite3.connect('faq_chatbot.db')
    c = conn.cursor()

    query1 = '''CREATE TABLE IF NOT EXISTS faq_articles 
            (article_id TEXT PRIMARY KEY, 
            title TEXT NOT NULL, 
            content TEXT NOT NULL,  
            url TEXT, 
            embedding BLOB,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'''

    # check if embedding column exists, if not add it to DB
    # c.execute("PRAGMA table_info(faq_articles)")
    # columns = [column[1] for column in c.fetchall()]

    # if 'embedding' not in columns:
    #    print("adding embedding column to faq table...")
    #    c.execute("ALTER TABLE faq_articles ADD COLUMN embedding BLOB")

    # creating table for FAQ articles
    c.execute(query1)

    query2 = '''CREATE TABLE IF NOT EXISTS chat_history 
                (id INTEGER PRIMARY KEY, 
                session_id TEXT, 
                user_message TEXT, 
                bot_response TEXT, 
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'''

    # chat history table
    c.execute(query2)

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized.")