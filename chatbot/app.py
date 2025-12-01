from flask import Flask, request, jsonify, session, render_template
import uuid
from datetime import datetime
import sqlite3
import re
import os

from config import Config
from database import DatabaseManager
from models import init_db

# Try to import Atlassian client
try:
    from atlassian_client import AtlassianClient
    atlassian_client = AtlassianClient()
    ATLASSIAN_AVAILABLE = True
    print("Atlassian client loaded successfully")
except Exception as e:
    print(f"Atlassian client failed: {e}")
    ATLASSIAN_AVAILABLE = False
    atlassian_client = None

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = app.config['SECRET_KEY']

# Initialize components
init_db()
db_manager = DatabaseManager()

def format_answer(content, max_length=500):
    # Format answer for better readability
    if not content:
        return "No content available."
    
    # Simple cleanup
    clean_content = re.sub('<[^<]+?>', '', content)  # Remove HTML tags
    clean_content = ' '.join(clean_content.split())  # Remove extra whitespace
    
    # Truncate if too long
    if len(clean_content) > max_length:
        clean_content = clean_content[:max_length] + "..."
    
    return clean_content

def add_test_articles():
    # Add test articles if database is empty
    conn = db_manager.get_connection()
    c = conn.cursor()
    
    c.execute('SELECT COUNT(*) FROM faq_articles')
    count = c.fetchone()[0]
    
    if count == -1:
        print(" Adding test articles to database...")
        test_articles = [
            {
                'article_id': 'test1',
                'title': 'How to Reset Your Password',
                'content': 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and you will receive a password reset link within 5 minutes.',
                'url': 'https://example.com/password-reset',
                'last_updated': datetime.utcnow().isoformat()
            },
            {
                'article_id': 'test2',
                'title': 'Troubleshooting Login Issues',
                'content': 'If you cannot login, first check that your username and password are correct. Make sure Caps Lock is not enabled. Clear your browser cache and cookies.',
                'url': 'https://example.com/login-help',
                'last_updated': datetime.utcnow().isoformat()
            },
            {
                'article_id': 'test3',
                'title': 'Setting Up Two-Factor Authentication',
                'content': 'Two-factor authentication adds extra security. Go to Security Settings, click Enable 2FA, and follow the setup wizard with your mobile device.',
                'url': 'https://example.com/2fa-setup',
                'last_updated': datetime.utcnow().isoformat()
            }
        ]
        
        for article in test_articles:
            try:
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
                print(f"   Added: {article['title']}")
            except Exception as e:
                print(f"   Failed to add '{article['title']}': {e}")
        
        conn.commit()
        print(" Added test articles to database")
    
    conn.close()

# Add test data on startup
# add_test_articles()

@app.before_request
def make_session_permanent():
    session.permanent = True
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())

@app.route('/')
def index():
    # Serve the main chat interface 
    return render_template('index.html')

@app.route('/api/sync', methods=['POST'])
def sync_articles():
    # Endpoint to sync articles from Atlassian
    print("Sync endpoint called")
    
    if not ATLASSIAN_AVAILABLE:
        return jsonify({
            'status': 'error', 
            'message': 'Atlassian client not configured properly. Check your .env file.',
            'test_data': True
        }), 500
    
    try:
        print("Testing Atlassian connection...")
        # Test connection first
        if not atlassian_client.test_connection():
            return jsonify({
                'status': 'error',
                'message': 'Cannot connect to Atlassian. Check your credentials and network.'
            }), 500
        
        print("Fetching articles from Atlassian...")
        articles_data = atlassian_client.get_articles(limit=50)
        if not articles_data:
            return jsonify({
                'status': 'error', 
                'message': 'No articles found. Check your space key and permissions.'
            }), 404
            
        parsed_articles = [atlassian_client.parse_article_content(article) for article in articles_data]
        db_manager.sync_articles(parsed_articles)
        
        return jsonify({
            'status': 'success', 
            'message': f'Synced {len(parsed_articles)} articles, generated embeddings',
            'count': len(parsed_articles)
        })
    
    except AttributeError as e:
        print(f"Attribute rror in sync: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Atlassian client method missing. Check atlassian_client.py has all required methods'
        }), 500
    except Exception as e:
        print(f"Sync error: {e}")
        return jsonify({
            'status': 'error', 
            'message': f'Sync failed: {str(e)}'
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    # Handle chat messages
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        session_id = session.get('session_id')

        relevant_articles = db_manager.search_articles_llm(user_message, limit=3)

        if relevant_articles:
            context = "\n\n".join([f"# {a['title']}\n{a['content']}"
                                   for a in relevant_articles])
            
            prompt = f"""You are a helpful FAQ assistant. Use the following knowledgebase articles to answer the user's question accurately and helpfully.
                        User Question: {user_message}

                        Knowledgebase articles:
                        {context}

                        Instructions:
                            - Answer based ONLY on the provided articles
                            - Be concise but comprehensive
                            - If the articles don't contain the answer, politely state as such
                            - Include relevant details from the articles
                            - Format your response in clear and readable paragraphs.
                            - If the response includes a numbered list, bullet points, or any other specially formatted objects, make sure to format for human readability. That is, if you have a numbered list, have each number entry (along with it's content) appear on a new line.

                        Answer:"""
            
            answer = db_manager.generate_ollama_response(prompt)

            if not answer:
                # traditional formatting fallback
                answer = format_answer(relevant_articles[0]['content'])

            response_data = {
                'answer': answer,
                'sources': [a['title'] for a in relevant_articles],
                'urls': [a['url'] for a in relevant_articles]
            }

        else:
            response_data = {
                'answer': "I couldn't find relevant information in our knowledge base. Please try rephrasing your question or contact support for assistance.",
                'sources': [],
                'urls': []
            }

        db_manager.save_chat(session_id, user_message, response_data['answer'])
        return jsonify(response_data)
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    # Health check endpoint
    return jsonify({
        'status': 'healthy', 
        'timestamp': datetime.now(datetime.timezone.utc),
        'atlassian_available': ATLASSIAN_AVAILABLE
    })

if __name__ == '__main__':
    print("Starting FAQ Chatbot...")
    print("Available endpoints:")
    print("   GET  /              - Chat interface")
    print("   POST /api/sync      - Sync articles from Atlassian") 
    print("   POST /api/chat      - Send chat message")
    print("   GET  /api/health    - Health check")
    app.run(debug=True, port=5000)