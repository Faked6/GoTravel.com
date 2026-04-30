import sqlite3
import os
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_folder='.')

# Database configuration
DB_FILE = 'users.db'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')
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
    conn.commit()
    conn.close()

# Initialize DB on startup
if not os.path.exists(DB_FILE):
    init_db()
else:
    # ensure table exists just in case
    init_db()

# Serve static files
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

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
    c.execute('SELECT name, email, password_hash FROM users WHERE email = ?', (email,))
    user = c.fetchone()
    conn.close()

    if user and check_password_hash(user[2], password):
        return jsonify({'message': 'Login successful', 'user': {'name': user[0], 'email': user[1]}}), 200
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

if __name__ == '__main__':
    print("Starting GoTravel.com Backend Server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
