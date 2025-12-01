import sqlite3
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import requests
import json
from datetime import datetime
from config import OLLAMA_CONFIG
import ollama

class DatabaseManager:
    def __init__(self, db_path='faq_chatbot.db'):
        self.db_path = db_path

        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        # self.ollama_url = f"{OLLAMA_CONFIG['base_url']}/api/generate"
        self.ollama_client = ollama.Client(host=OLLAMA_CONFIG['base_url'])
        self.model = OLLAMA_CONFIG['model']
        self.index = None
        self.article_map ={}
        self.load_vector_index()

    def load_vector_index(self):
        # load/create FAISS vector table
        conn = self.get_connection()
        c = conn.cursor()

        # check if embeddings already exist
        c.execute('SELECT COUNT(*) FROM faq_articles WHERE embedding IS NOT NULL')
        count = c.fetchone()[0]

        if count == 0:
            print("No embeddings found, vector search unavailable")
            conn.close()
            return
        
        # load articles and embeddings
        c.execute('SELECT article_id, title, content, url, embedding FROM faq_articles WHERE embedding IS NOT NULL')
        articles = c.fetchall()
        conn.close()

        if not articles:
            return
        
        embeddings = []
        self.article_map = {}

        for i, (article_id, title, content, url, embedding_blob) in enumerate(articles):
            embedding = np.frombuffer(embedding_blob, dtype=np.float32)
            embeddings.append(embedding)

            self.article_map[i] = {
                'id': article_id,
                'title': title,
                'content': content,
                'url': url
            }

        embeddings = np.array(embeddings)
        self.index = faiss.IndexFlatIP(embeddings.shape[1])
        self.index.add(embeddings)
        print(f"Loaded vector index with {len(embeddings)} articles")

    def generate_embeddings(self, articles):
        # generate and store embeddings for articles
        conn = self.get_connection()
        c = conn.cursor()

        for article in articles:
            # combine title and content for better semantic representation
            text = f"{article['title']} {article['content']}"
            embedding = self.embedding_model.encode([text])[0]

            # store in DB
            c.execute('UPDATE faq_articles SET embedding = ? WHERE article_id = ?',
                      (embedding.tobytes(), article['article_id']))
            
        conn.commit()
        conn.close()
        self.load_vector_index() #reload index
    
    def semantic_search(self, query, limit=5):
        # pure semantic searching using the vector embeddings
        if self.index is None or len(self.article_map) == 0:
            return []
        
        # encode the query
        query_embedding = self.embedding_model.encode([query])

        # search
        similarities, indices = self.index.search(query_embedding, limit)

        results = []
        for i, idx in enumerate(indices[0]):
            if idx in self.article_map and similarities[0][i] > 0.3: # 0.3 is the similarity threshold, tinker if results not as desired
                results.append(self.article_map[idx])

        return results

    def generate_ollama_response(self, prompt):
        # generate response using ollama library
        try:
            response = self.ollama_client.generate(
                model = self.model, 
                prompt=prompt, 
                options={
                    'temperature': 0.1,
                    'top_p': 0.9,
                    'num_ctx': 8192 # context window
                }
            )
            return response['response']
        except Exception as e:
            print(f"Ollama error: {e}")
            return None

    def search_articles_llm(self, query, limit=5):
        # hybrid of semantic searching and LLM reranking
        semantic_results = self.semantic_search(query, limit=10)

        if not semantic_results:
            return []
        
        if len(semantic_results) <= 3:
            return semantic_results[:limit]
        
        # llm picks most relevant
        articles_list = "\n".join([
            f"{i+1}. {a['title']}: {a['content'][:200]}..."
            for i, a in enumerate(semantic_results)
        ]) 

        prompt = f"""Select the {limit} most relevant articles for: "{query}"
                    Articles:
                    {articles_list}

                    Return ONLY numbers separated by commas, like: 2,5,1"""
        
        try:
            response = self.generate_ollama_response(prompt)
            if response:
                numbers = [int(x.strip()) for x in response.split(',') if x.strip().isdigit()]
                selected_indices = [n-1 for n in numbers if 0 <= n-1 < len(semantic_results)]
                return [semantic_results[i] for i in selected_indices[:limit]]
        except:
            pass

        return semantic_results[:limit]

    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    def sync_articles(self, articles):
        """Sync articles from Atlassian to local database, generate embeddings"""
        conn = self.get_connection()
        c = conn.cursor()
        
        print(f"Syncing {len(articles)} articles to database...")
        
        for article in articles:
            try:
                c.execute('''
                    INSERT OR REPLACE INTO faq_articles 
                    (article_id, title, content, url, last_updated)
                    VALUES (?, ?, ?, ?, ?)''', (
                    article['article_id'],
                    article['title'],
                    article['content'],
                    article['url'],
                    article['last_updated']
                ))
                # print(f"   Synced: {article['title']}")
            except Exception as e:
                print(f"   Failed to sync '{article['title']}': {e}")
        
        conn.commit()
        conn.close()

        self.generate_embeddings(articles)
        print(f" Successfully synced {len(articles)} articles to database")
    
#    def search_articles(self, query, limit=5):
#        # Search for relevant articles based on query
#        conn = self.get_connection()
#        c = conn.cursor()
#        
#        # Simple keyword search
#        search_term = f'%{query}%'
#        
#        try:
#            c.execute('''
#                SELECT title, content, url 
#                FROM faq_articles 
#                WHERE title LIKE ? OR content LIKE ?
#                LIMIT ?
#            ''', (search_term, search_term, limit))
#            
#            results = c.fetchall()
#            
#            formatted_results = []
#            for row in results:
#                formatted_results.append({
#                    'title': row[0], 
#                    'content': row[1], 
#                    'url': row[2]
#                })
#            
#            return formatted_results
#            
#        except Exception as e:
#            print(f" Search error: {e}")
#            return []
#        finally:
#            conn.close()

    def search_articles(self, query, limit=5):
        return self.search_articles_llm(query, limit)

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

    def debug_search(self, query):
        # debugging vector search
        print(f"Testing search for: '{query}'")
        results = self.semantic_search(query, limit=5)
        print(f"Found {len(results)} results")
        for i, r in enumerate(results):
            print(f"    {i+1}. {r['title']}")
        return results