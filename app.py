from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

DB_FILE = "agriguard.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS consultations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            crop TEXT NOT NULL,
            issue TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "healthy", "app": "AgriGuard Production Server"}), 200

@app.route('/api/contact', methods=['POST', 'OPTIONS'])
def contact_specialist():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    data = request.get_json(silent=True) or request.form.to_dict() or {}
    name = data.get("name", "").strip()
    phone = data.get("phone", "").strip()
    crop = data.get("crop", "").strip()
    issue = data.get("issue", "").strip()

    if not name or not phone or not crop or not issue:
        return jsonify({"success": False, "message": "All fields are required."}), 400

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO consultations (name, phone, crop, issue) VALUES (?, ?, ?, ?)",
            (name, phone, crop, issue)
        )
        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Consultation request registered successfully! An agri specialist will reach out."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)