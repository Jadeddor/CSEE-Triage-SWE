import sqlite3 as s

# connect will connect withe the local DB
# if doesn't exist, it will create one
con=s.connect("tutorial.db")

# create a cursor in order to:
# - execute SQL statement
# - fetch results from queries
cur = con.cursor()

# .execute() executes a SQL statement
# below creates a DB table named "movie"
# with 3 columns, "title year and score"
#cur.execute("" \
#"CREATE TABLE movie(title, year, score)"
#)


#cur.execute("" \
#"INSERT INTO movie VALUES\
#            ('Monty Python and the Holy Grail', 1975, 8.2),\
#            ('And Now for Something Completely Different', 1971, 7.5)"
#)

res = cur.execute("SELECT name FROM sqlite_master")
res = res.fetchall()

cur.execute("CREATE TABLE IF NOT EXISTS faqs(" \
"qid INTEGER PRIMARY KEY, " \
"question TEXT NOT NULL, " \
"answer TEXT NOT NULL" \
")")

data = [
    (1, "How are you?", "Good"),
    (2, "What is our college?", "UMBC"),
    (3, "What is the course?", "CMSC447"),
    (4, "What is the element we breathe?", "Oxygen"),
    (6, "What is the color of the sky?", "Blue"),
    (7, "Testing", "Testing Answer")
]

res = cur.execute("SELECT qid FROM faqs")
res = res.fetchall()

cur.executemany("INSERT OR REPLACE INTO faqs VALUES(?, ?, ?)", data)
con.commit()

#res = cur.execute("SELECT qid FROM faqs")
#res = res.fetchall()
#print(res)


for row in cur.execute("SELECT question, answer FROM faqs ORDER BY qid"):
    print(row)

print("The first section of testing has completed.\n\n\n")

data.append((8, "Test2", "test2A"))

cur.executemany("INSERT OR REPLACE INTO faqs VALUES(?, ?, ?)", data)
con.commit()

for row in cur.execute("SELECT question, answer FROM faqs ORDER BY qid"):
   print(row)