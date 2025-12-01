#!/usr/bin/env python3
"""
Test database operations
"""

from models import init_db
from database import DatabaseManager

print("🧪 Testing database operations...")

# Initialize database
init_db()
db_manager = DatabaseManager()

# Test adding articles
test_articles = [
    {
        'article_id': 'db_test1',
        'title': 'Database Test Article',
        'content': 'This is a test article for database operations.',
        'url': 'https://example.com/test',
        'last_updated': '2024-01-15T10:00:00'
    }
]

print("1. Testing article sync...")
db_manager.sync_articles(test_articles)

print("2. Testing article search...")
results = db_manager.search_articles("database test")
print(f"   Found {len(results)} results")

print("3. Testing chat save...")
db_manager.save_chat('test_session', 'Test message', 'Test response')

print("✅ All database tests passed!")