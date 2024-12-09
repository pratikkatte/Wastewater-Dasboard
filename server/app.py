from flask import Flask, jsonify, request, send_from_directory
import os
import re
import pysam
import random
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.abspath(os.path.dirname(__file__)) + '/data'
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'bam', 'bai'}

# Create upload folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowedFile(filename):
    """Check if the file is of an allowed type."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def getUnseenMutationInfo(input_string):
    """Process unseen mutation information from string."""
    return input_string.replace('Z:', '').split(',')

def parseCommentsInfo(input_comment):
    """Parse comments and create a dictionary."""
    out_dict = {}
    for um in input_comment:
        um = re.sub(r'UM:', '', um)
        um = re.sub(r'US:', '', um)
        parts = um.split('\t')
        out_dict[parts[0]] = parts[1]
    return out_dict

def selectNodes(uploaded_filenames):
    """Process uploaded files and extract relevant data."""
    array = ["USA/UT-UPHL-220121588727/2021", "EGY/CCHE57357_Wave_4_142/2021"]
    file_dict = {}

    for filename in uploaded_filenames:
        try:
            bam = pysam.AlignmentFile(filename, 'rb')
            headers = bam.header
            read_groups = headers.get('RG', [])
            unseen_mutation_comments = headers.get('CO', [])
            um_dicts = parseCommentsInfo(unseen_mutation_comments)
            if not read_groups:
                file_dict[random.choice(array)] = {"filename": filename, "groupname": ""}
            else:
                for read_group in read_groups:
                    node_name = read_group['DS'].replace("Node:", "")
                    group_name = read_group['ID']
                    unseen_mutations = getUnseenMutationInfo(read_group.get('UM', ''))
                    temp_dict = [{um_key: um_dicts.get(um_key, "")} for um_key in unseen_mutations]
                    file_dict[node_name] = {
                        "filename": os.path.basename(filename),
                        "groupname": group_name,
                        group_name: temp_dict,
                    }
        except Exception as e:
            print(f"Exception occurred: {e}")
    return file_dict

@app.route('/')
def status():
    return "success"

@app.route('/uploads/<name>')
def download_file(name):
    """Endpoint to download files."""
    return send_from_directory(app.config["UPLOAD_FOLDER"], name)

@app.route('/api/upload', methods=['POST', 'GET'])
def fileUpload():
    """Endpoint to handle file uploads."""
    if request.method == 'POST':
        uploaded_files = []
        files = request.files.getlist('file')
        for f in files:
            filename = secure_filename(f.filename)
            if allowedFile(filename):
                file_save_path = os.path.join(UPLOAD_FOLDER, filename)
                f.save(file_save_path)
                if filename.endswith('.bam'):
                    uploaded_files.append(file_save_path)
            else:
                return jsonify({'status': 'File type not allowed'}), 400

        file_dict = selectNodes(uploaded_files)
        return jsonify({"response": file_dict, "status": "success"})
    else:
        return jsonify({"status": "failed"})

if __name__ == '__main__':
    app.run(debug=True)
