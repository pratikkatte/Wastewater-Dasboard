from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    filename = file.filename
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    
    with open(file_path, 'wb') as f:
        for chunk in file.stream:
            f.write(chunk)
            process_chunk(chunk)
            # Emit progress back to client
            socketio.emit('progress', {'progress': get_progress(file_path), 'filename': filename})
    
    return jsonify({"message": "File uploaded and processed successfully"}), 200

def process_chunk(chunk):
    # Simulate processing the chunk (e.g., counting lines, processing data)
    print(chunk)
    print(f"Processing chunk of size {len(chunk)}")

def get_progress(file_path):
    # Dummy implementation for progress (replace with actual logic)
    return min(100, os.path.getsize(file_path) / 1000)

if __name__ == '__main__':
    socketio.run(app, debug=True)
