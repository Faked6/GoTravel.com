import sqlite3
import os
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_folder='public')

# Database configuration
DB_FILE = 'users.db'

ADMIN_EMAIL = 'admin@gotravel.com'
ADMIN_PASSWORD = 'admin123'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin INTEGER NOT NULL DEFAULT 0
        )
    ''')
    # Add is_admin column if missing (existing DBs)
    try:
        c.execute('ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0')
    except sqlite3.OperationalError:
        pass

    c.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            property_name TEXT NOT NULL,
            check_in TEXT NOT NULL,
            check_out TEXT NOT NULL,
            persons INTEGER NOT NULL DEFAULT 1,
            total_price INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (user_email) REFERENCES users (email)
        )
    ''')
    try:
        c.execute('ALTER TABLE bookings ADD COLUMN persons INTEGER NOT NULL DEFAULT 1')
        c.execute('ALTER TABLE bookings ADD COLUMN total_price INTEGER NOT NULL DEFAULT 0')
    except sqlite3.OperationalError:
        pass

    c.execute('''
        CREATE TABLE IF NOT EXISTS threads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            user_name TEXT NOT NULL,
            user_email TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            thread_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            user_name TEXT NOT NULL,
            user_email TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (thread_id) REFERENCES threads (id)
        )
    ''')

    # Seed admin account if not exists
    c.execute('SELECT id FROM users WHERE email = ?', (ADMIN_EMAIL,))
    if not c.fetchone():
        c.execute('INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, 1)',
                  ('Admin', ADMIN_EMAIL, generate_password_hash(ADMIN_PASSWORD)))
    else:
        c.execute('UPDATE users SET is_admin = 1 WHERE email = ?', (ADMIN_EMAIL,))

    conn.commit()
    conn.close()

def is_admin_request(req):
    """Check if the request comes from the admin user."""
    data = req.json or {}
    return data.get('admin_email') == ADMIN_EMAIL

# Initialize DB on startup
if not os.path.exists(DB_FILE):
    init_db()
else:
    # ensure table exists just in case
    init_db()

# Serve static files
@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

# API Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    
    # Check if email exists
    c.execute('SELECT id FROM users WHERE email = ?', (email,))
    if c.fetchone():
        conn.close()
        return jsonify({'error': 'Email already registered'}), 409

    # Hash password and insert
    hashed_pw = generate_password_hash(password)
    c.execute('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', (name, email, hashed_pw))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Registration successful', 'user': {'name': name, 'email': email}}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing email or password'}), 400

    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT name, email, password_hash, is_admin FROM users WHERE email = ?', (email,))
    user = c.fetchone()
    conn.close()

    if user and check_password_hash(user[2], password):
        return jsonify({'message': 'Login successful', 'user': {'name': user[0], 'email': user[1], 'is_admin': bool(user[3])}}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/book', methods=['POST'])
def book():
    data = request.json
    email = data.get('email')
    property_name = data.get('property_name')
    check_in = data.get('check_in')
    check_out = data.get('check_out')
    persons = data.get('persons', 1)
    total_price = data.get('total_price', 0)

    if not all([email, property_name, check_in, check_out]):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('INSERT INTO bookings (user_email, property_name, check_in, check_out, persons, total_price) VALUES (?, ?, ?, ?, ?, ?)', 
              (email, property_name, check_in, check_out, persons, total_price))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Booking successful'}), 201

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Missing email'}), 400

    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT id, property_name, check_in, check_out, persons, total_price FROM bookings WHERE user_email = ?', (email,))
    rows = c.fetchall()
    conn.close()

    bookings = [{'id': row[0], 'property_name': row[1], 'check_in': row[2], 'check_out': row[3], 'persons': row[4], 'total_price': row[5]} for row in rows]
    return jsonify({'bookings': bookings}), 200

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('DELETE FROM bookings WHERE id = ?', (booking_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Booking canceled successfully'}), 200

@app.route('/api/threads', methods=['GET'])
def get_threads():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        SELECT t.id, t.title, t.content, t.user_name, t.user_email, t.created_at, 
               (SELECT COUNT(*) FROM comments WHERE thread_id = t.id) as comment_count
        FROM threads t
        ORDER BY t.created_at DESC
    ''')
    rows = c.fetchall()
    conn.close()
    
    threads = [{'id': row[0], 'title': row[1], 'content': row[2], 'user_name': row[3], 'user_email': row[4], 'created_at': row[5], 'comment_count': row[6]} for row in rows]
    return jsonify({'threads': threads}), 200

@app.route('/api/threads', methods=['POST'])
def create_thread():
    data = request.json
    title = data.get('title')
    content = data.get('content')
    user_name = data.get('user_name')
    user_email = data.get('user_email')
    
    if not all([title, content, user_name, user_email]):
        return jsonify({'error': 'Missing required fields'}), 400
        
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('INSERT INTO threads (title, content, user_name, user_email) VALUES (?, ?, ?, ?)',
              (title, content, user_name, user_email))
    thread_id = c.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Thread created', 'id': thread_id}), 201

@app.route('/api/threads/<int:thread_id>', methods=['GET'])
def get_thread(thread_id):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT id, title, content, user_name, user_email, created_at FROM threads WHERE id = ?', (thread_id,))
    thread_row = c.fetchone()
    
    if not thread_row:
        conn.close()
        return jsonify({'error': 'Thread not found'}), 404
        
    c.execute('SELECT id, content, user_name, user_email, created_at FROM comments WHERE thread_id = ? ORDER BY created_at ASC', (thread_id,))
    comment_rows = c.fetchall()
    conn.close()
    
    thread = {
        'id': thread_row[0], 'title': thread_row[1], 'content': thread_row[2], 
        'user_name': thread_row[3], 'user_email': thread_row[4], 'created_at': thread_row[5]
    }
    comments = [{'id': row[0], 'content': row[1], 'user_name': row[2], 'user_email': row[3], 'created_at': row[4]} for row in comment_rows]
    
    return jsonify({'thread': thread, 'comments': comments}), 200

@app.route('/api/threads/<int:thread_id>/comments', methods=['POST'])
def create_comment(thread_id):
    data = request.json
    content = data.get('content')
    user_name = data.get('user_name')
    user_email = data.get('user_email')
    
    if not all([content, user_name, user_email]):
        return jsonify({'error': 'Missing required fields'}), 400
        
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('INSERT INTO comments (thread_id, content, user_name, user_email) VALUES (?, ?, ?, ?)',
              (thread_id, content, user_name, user_email))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Comment added'}), 201

# ── Admin Routes ─────────────────────────────────────────────────────────────

@app.route('/api/admin/users', methods=['GET'])
def admin_get_users():
    if request.args.get('admin_email') != ADMIN_EMAIL:
        return jsonify({'error': 'Unauthorized'}), 403
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT id, name, email, is_admin FROM users ORDER BY id')
    rows = c.fetchall()
    conn.close()
    users = [{'id': r[0], 'name': r[1], 'email': r[2], 'is_admin': bool(r[3])} for r in rows]
    return jsonify({'users': users}), 200

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
def admin_delete_user(user_id):
    data = request.json or {}
    if data.get('admin_email') != ADMIN_EMAIL:
        return jsonify({'error': 'Unauthorized'}), 403
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT email, is_admin FROM users WHERE id = ?', (user_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        return jsonify({'error': 'User not found'}), 404
    if row[1]:
        conn.close()
        return jsonify({'error': 'Cannot delete admin account'}), 400
    email = row[0]
    c.execute('DELETE FROM bookings WHERE user_email = ?', (email,))
    c.execute('DELETE FROM comments WHERE user_email = ?', (email,))
    c.execute('DELETE FROM threads WHERE user_email = ?', (email,))
    c.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'User and their data deleted'}), 200

@app.route('/api/admin/bookings', methods=['GET'])
def admin_get_bookings():
    if request.args.get('admin_email') != ADMIN_EMAIL:
        return jsonify({'error': 'Unauthorized'}), 403
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT id, user_email, property_name, check_in, check_out, persons, total_price FROM bookings ORDER BY id DESC')
    rows = c.fetchall()
    conn.close()
    bookings = [{'id': r[0], 'user_email': r[1], 'property_name': r[2], 'check_in': r[3], 'check_out': r[4], 'persons': r[5], 'total_price': r[6]} for r in rows]
    return jsonify({'bookings': bookings}), 200

@app.route('/api/admin/bookings/<int:booking_id>', methods=['DELETE'])
def admin_delete_booking(booking_id):
    data = request.json or {}
    if data.get('admin_email') != ADMIN_EMAIL:
        return jsonify({'error': 'Unauthorized'}), 403
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('DELETE FROM bookings WHERE id = ?', (booking_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Booking deleted'}), 200

@app.route('/api/admin/threads', methods=['GET'])
def admin_get_threads():
    if request.args.get('admin_email') != ADMIN_EMAIL:
        return jsonify({'error': 'Unauthorized'}), 403
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        SELECT t.id, t.title, t.user_name, t.user_email, t.created_at,
               (SELECT COUNT(*) FROM comments WHERE thread_id = t.id) as cc
        FROM threads t ORDER BY t.created_at DESC
    ''')
    rows = c.fetchall()
    conn.close()
    threads = [{'id': r[0], 'title': r[1], 'user_name': r[2], 'user_email': r[3], 'created_at': r[4], 'comment_count': r[5]} for r in rows]
    return jsonify({'threads': threads}), 200

@app.route('/api/admin/threads/<int:thread_id>', methods=['DELETE'])
def admin_delete_thread(thread_id):
    data = request.json or {}
    if data.get('admin_email') != ADMIN_EMAIL:
        return jsonify({'error': 'Unauthorized'}), 403
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('DELETE FROM comments WHERE thread_id = ?', (thread_id,))
    c.execute('DELETE FROM threads WHERE id = ?', (thread_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Thread and comments deleted'}), 200

@app.route('/api/admin/comments/<int:comment_id>', methods=['DELETE'])
def admin_delete_comment(comment_id):
    data = request.json or {}
    if data.get('admin_email') != ADMIN_EMAIL:
        return jsonify({'error': 'Unauthorized'}), 403
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('DELETE FROM comments WHERE id = ?', (comment_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Comment deleted'}), 200

@app.route('/api/admin/threads/<int:thread_id>/comments', methods=['GET'])
def admin_get_comments(thread_id):
    if request.args.get('admin_email') != ADMIN_EMAIL:
        return jsonify({'error': 'Unauthorized'}), 403
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT id, content, user_name, user_email, created_at FROM comments WHERE thread_id = ? ORDER BY created_at ASC', (thread_id,))
    rows = c.fetchall()
    conn.close()
    comments = [{'id': r[0], 'content': r[1], 'user_name': r[2], 'user_email': r[3], 'created_at': r[4]} for r in rows]
    return jsonify({'comments': comments}), 200

if __name__ == '__main__':
    print("Starting GoTravel.com Backend Server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
