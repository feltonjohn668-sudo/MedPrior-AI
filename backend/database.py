import sqlite3
from pathlib import Path
DB_PATH = Path(__file__).parent / 'saltsaver.db'

def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection

def init_db():
    with get_connection() as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            score REAL NOT NULL,
            inputs_json TEXT NOT NULL
        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS savings_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            medicine TEXT NOT NULL,
            monthly_quantity INTEGER NOT NULL,
            estimated_savings REAL NOT NULL
        )''')
