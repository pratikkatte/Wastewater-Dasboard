from app import app

# import os
# import random
# from flask import Flask, request, jsonify
# from werkzeug.utils import secure_filename
# from flask_cors import CORS
# import pysam
# from io import BytesIO
# from llm import getLLMResponse

# app = Flask(__name__)
# CORS(app)

# UPLOAD_FOLDER = 'static/data'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# def selectNodes(uploaded_filenames, uploadtype):
#     """
#     """
#     array = ["USA/UT-UPHL-220121588727/2021", "EGY/CCHE57357_Wave_4_142/2021"]
#     file_dict = {}
#     saved_filenames = []
#     if uploadtype=='file':
#         for file in uploaded_filenames:
#             filename = secure_filename(file.filename)
#             # Save file
#             save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             file.save(save_path)
#             saved_filenames.append(filename)
#     else:
#         saved_filenames = uploaded_filenames

#     for filename in saved_filenames:
#         try:
#             if '.bam.bai' in filename:
#                 continue
#             path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             bam = pysam.AlignmentFile(path, 'rb')
#             headers = bam.header
#             read_groups = headers.get('RG', [])
#             if read_groups==None:
#                 file_dict[random.choice(array)] = {"filename": filename, "groupname": ""}
#             else:

#                 if len(read_groups) > 0:
#                     for read_group in read_groups:
#                         node_name = read_group['DS'].replace("Node:","")
#                         group_name = read_group['ID']
#                         file_dict[node_name] = {"filename":filename, "groupname":group_name}
#         except Exception as e:
#             print("error")
#             return {}
#     print("file_dict",file_dict)
#     return file_dict

# @app.route('/api/upload', methods=['POST'])
# def file_upload():
#     print(request.form)
#     uploadtype = request.form.getlist('uploadtype')[0]
#     if uploadtype == 'file':
#         if 'file' not in request.files:
#             return jsonify({'error': 'No file part'}), 400
        
#         uploaded_files = request.files.getlist('file')

#         if uploaded_files:
#             file_dict = selectNodes(uploaded_files, uploadtype)
#             return jsonify({'selected_nodes':file_dict}), 200
#     else:
#         uploaded_files = request.form.getlist('file')
#         if uploaded_files:
#             file_dict = selectNodes(uploaded_files, uploadtype)
#             return jsonify({'selected_nodes':file_dict}), 200
#         else:
#             return jsonify({'error': 'No file part'}), 400

# @app.route('/api/hello')
# def hello_world():
#     return jsonify(message='Hello, World from Flask!')

# @app.route('/api/chat', methods=['POST'])
# def chat_response():
#     if request.method == 'POST':
#         data = request.get_json()  
#         message = data.get('message')
#         response = getLLMResponse(message)
#         print(response)
#         # return jsonify({'message': "received message - "+ str(response['text'])})
#         return jsonify(response)

# if __name__ == '__main__':
#     if not os.path.exists(UPLOAD_FOLDER):
#         os.makedirs(UPLOAD_FOLDER)
#     app.run(debug=True)
