from database import DatabaseManager

db = DatabaseManager()
stats = db.get_stats()
print(f"Current Database Stats:")
print(f"   Articles: {stats['articles']}")
print(f"   FTS Indexed: {stats['fts_index']}")
print(f"   Chat Messages: {stats['chats']}")