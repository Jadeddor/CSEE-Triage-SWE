from flask import Flask, render_template, request, jsonify, session
import uuid
from datetime import datetime

from config import Config
from atlassian_client import AtlassianClient
from database import DatabaseManager
from models import init_db

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = app.config['SECRET_KEY']

# init components
init_db()
atlassian_client = AtlassianClient()
db_manager = DatabaseManager()

@app.before_request
def make_session_permanent():
    session.permanent = True
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sync')
def sync_articles():
    #endpoint for syncing from Atlassian
    try:
        articles_data = atlassian_client.get_articles()
        parsed_articles = [atlassian_client.parse_article_content(article) for article in articles_data]
        db_manager.sync_articles(parsed_articles)
        return jsonify({'status':'success', 'message':f'Synced {len(parsed_articles)} articles'})
    except Exception as e:
        return jsonify({'status':'error', 'message':str(e)})
    
@app.route('/chat', methods=['POST'])
def chat():
    # handling chat msgs
    user_message = request.json.get('message', '')
    session_id = session.get('session_id')

    if not user_message:
        return jsonify({'error': "No message provided"}), 400
    
    relevant_articles = db_manager.search_articles(user_message)

    if relevant_articles:
        response = {
            'answer': relevant_articles[0]['content'][:500] + "...",
            'source': relevant_articles[0]['title'],
            'url': relevant_articles[0]['url'],
            'suggestions': [article['title'] for article in relevant_articles[1:4]]
        }
    else:
        response = {
            'answer': "I couldn't find relevant information in our knowledge base. Please try rephrasing your question, or contacting support. (insert ticket link)",
            'source': None,
            'url': None,
            'suggestions': []
        }

    #save chat
    db_manager.save_chat(session_id, user_message, response['answer'])

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
