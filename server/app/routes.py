from app import app
import re
import os
from flask import jsonify, request
import pysam
import random
from werkzeug.utils import secure_filename
from flask import send_from_directory


UPLOAD_FOLDER = os.path.abspath(os.path.dirname(__file__))+ '/data'
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    
ALLOWED_EXTENSIONS = set(['bam', 'bai'])

def getUnseenMutationInfo(input_string):
    """
    """
    input_string = input_string.replace('Z:', '').split(',')

    return input_string

def parseCommentsInfo(input_comment):
    """
    """
    out_dict = {}
    for um in input_comment:
        um = re.sub(r'UM:', '', um)
        um = re.sub(r'US:', '', um)
        parts = um.split('\t')
        out_dict[parts[0]] = parts[1]

    return out_dict
    
def selectNodes(uploaded_filenames):
    """
    return:
    file_dict = {
    <node_name> : {
        'filename': <file_name>,
        'read_group': <read_group_id>,
        <read_group_id> : [
                {
                    'unseenKey':<unseenid>, 
                    'mutation':<mutation>
                }
            ]
        }
    }
    """
    array = ["USA/UT-UPHL-220121588727/2021", "EGY/CCHE57357_Wave_4_142/2021"]
    file_dict = {}

    print(uploaded_filenames)
    for filename in uploaded_filenames:
        try:
            bam = pysam.AlignmentFile(filename, 'rb')
            headers = bam.header
            print("headers", headers)
            read_groups = headers.get('RG', [])
            unseen_mutation_comments = headers.get('CO', [])
            um_dicts = parseCommentsInfo(unseen_mutation_comments)
            if read_groups==None:
                file_dict[random.choice(array)] = {"filename": filename, "groupname": ""}
            else:
                if len(read_groups) > 0:
                    for read_group in read_groups:
                        node_name = read_group['DS'].replace("Node:","")
                        group_name = read_group['ID']
                        
                        unseen_mutations = getUnseenMutationInfo(read_group['UM'])

                        # file_dict[group_name] = {"filename": os.path.basename(filename), "node_name": node_name}
                        temp_dict = []
                        for um_key in unseen_mutations:

                            temp_dict.append({um_key:um_dicts[um_key]})

                        file_dict[node_name] = {
                            "filename":os.path.basename(filename), 
                            "groupname":group_name,
                            group_name:temp_dict,

                            }
            
        except Exception as e:
            print("exception", e)
            return file_dict
    return file_dict

def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/uploads/<name>')
def download_file(name):
    return send_from_directory(app.config["UPLOAD_FOLDER"], name)

@app.route('/api/upload', methods=['POST', 'GET'])
def fileUpload():
    if request.method == 'POST':
        uploaded_files = []
        print(request.files)
        file = request.files.getlist('file')
        print(file)
        for f in file:
            filename = secure_filename(f.filename)
            if allowedFile(filename):
                file_save_path = os.path.join(UPLOAD_FOLDER, filename)

                if filename.endswith('.bam'):
                    uploaded_files.append(file_save_path)
                f.save(file_save_path)
            else:
                return jsonify({'status': 'File type not allowed'}), 400
        
        file_dict = selectNodes(uploaded_files)
        print(file_dict)
        # file_dict = {
        #     'group1': {'filename': 'corrected_bam.bam', 'node_name': 'Germany/IMS-10209-CVDP-D48209F5-5BED-436E-BFC4-D2118C232BC4/2021'}, 
        #     'group2': {'filename': 'corrected_bam.bam', 'node_name': 'England/PHEC-Z306ZA27/2021'}
        #     }
        return jsonify({"response": file_dict, "status": "success"})
    else:
        return jsonify({"status":"failed"})
