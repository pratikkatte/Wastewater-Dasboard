from app import app
import os
from flask import jsonify, request
import pysam
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.abspath(os.path.dirname(__file__))+ '/data'

ALLOWED_EXTENSIONS = set(['bam', 'bai'])


def selectNodes(uploaded_filenames):
    """
    """
    array = ["USA/UT-UPHL-220121588727/2021", "EGY/CCHE57357_Wave_4_142/2021"]
    file_dict = {}
    # saved_filenames = []
    # if uploadtype=='file':
    #     for file in uploaded_filenames:
    #         filename = secure_filename(file.filename)
    #         # Save file
    #         save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    #         file.save(save_path)
    #         saved_filenames.append(filename)
    # else:
    #     saved_filenames = uploaded_filenames
    print(uploaded_filenames)
    for filename in uploaded_filenames:
        try:
            bam = pysam.AlignmentFile(filename, 'rb')
            headers = bam.header
            read_groups = headers.get('RG', [])
            if read_groups==None:
                file_dict[random.choice(array)] = {"filename": filename, "groupname": ""}
            else:
                if len(read_groups) > 0:
                    for read_group in read_groups:
                        node_name = read_group['DS'].replace("Node:","")
                        group_name = read_group['ID']
                        file_dict[node_name] = {"filename":os.path.basename(filename), "groupname":group_name}
        except Exception as e:
            print("error",e)
            return file_dict
        
    print("file_dict",file_dict)
    return file_dict

def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/upload', methods=['POST', 'GET'])
def fileUpload():
    if request.method == 'POST':
        uploaded_files = []

        file = request.files.getlist('file')
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

        return jsonify({"selected_nodes": file_dict, "status": "success"})
    else:
        return jsonify({"status":"failed"})

