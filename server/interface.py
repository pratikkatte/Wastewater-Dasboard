
import os
import re
import random
import pysam
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
import uvicorn

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=['*'],
)

# Configuration
UPLOAD_FOLDER = os.path.abspath(os.path.dirname(__file__)) + '/data'
ALLOWED_EXTENSIONS = {"bam", "bai"}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Mount the React app (Vite build output) as a static folder

frontend_dir = "../dashboard/dist"
app.mount("/assets", StaticFiles(directory=f"{frontend_dir}/assets"), name="assets")

def allowed_file(filename: str) -> bool:
    """Check if the file is of an allowed type."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_unseen_mutation_info(input_string: str) -> List[str]:
    """Process unseen mutation information from string."""
    return input_string.replace('Z:', '').split(',')

def parse_comments_info(input_comment: List[str]) -> dict:
    """Parse comments and create a dictionary."""
    out_dict = {}
    for um in input_comment:
        um = re.sub(r'UM:', '', um)
        um = re.sub(r'US:', '', um)
        parts = um.split('\t')
        if len(parts) == 2:
            out_dict[parts[0]] = parts[1]
    return out_dict

def select_nodes(uploaded_filenames: List[str]) -> dict:
    """Process uploaded files and extract relevant data."""
    array = ["USA/UT-UPHL-220121588727/2021", "EGY/CCHE57357_Wave_4_142/2021"]
    file_dict = {}

    for filename in uploaded_filenames:
        try:
            bam = pysam.AlignmentFile(filename, 'rb')
            headers = bam.header
            read_groups = headers.get('RG', [])
            unseen_mutation_comments = headers.get('CO', [])

            if "HP_SEQ" in unseen_mutation_comments:
                file_dict['HP_SEQ']={
                    'filename': os.path.basename(filename)
                }
                continue

            um_dicts = parse_comments_info(unseen_mutation_comments)

            if not read_groups:
                file_dict[random.choice(array)] = {"filename": filename, "groupname": ""}
            else:
                for read_group in read_groups:
                    node_name = read_group['DS'].replace("Node:", "")
                    group_name = read_group['ID']
                    unseen_mutations = get_unseen_mutation_info(read_group.get('UM', ''))
                    temp_dict = [{um_key: um_dicts.get(um_key, "")} for um_key in unseen_mutations]
                    file_dict[node_name] = {
                        "filename": os.path.basename(filename),
                        "groupname": group_name,
                        group_name: temp_dict,
                    }
        except Exception as e:
            print(f"Exception occurred: {e}")
    return file_dict

@app.get('/status')
async def status():
    return {"status": "success"}

# Serve the index.html for the root endpoint
@app.get("/")
async def serve_react_app():
    index_file = f"{frontend_dir}/index.html"
    return FileResponse(index_file)

@app.get('/uploads/{name}')
def download_file(name: str):
    """Endpoint to download files."""
    file_path = os.path.join(UPLOAD_FOLDER, name)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")

@app.post('/api/upload')
def file_upload(files: List[UploadFile] = File(...)):


    """Endpoint to handle file uploads."""
    uploaded_files = []

    if not files:
        raise HTTPException(status_code=422, detail="No files uploaded")
    
    for file in files:
        filename = file.filename
        if allowed_file(filename):
            file_save_path = os.path.join(UPLOAD_FOLDER, filename)
            with open(file_save_path, "wb") as f:
                f.write(file.file.read())
            if filename.endswith('.bam'):
                uploaded_files.append(file_save_path)
        else:
            return JSONResponse(status_code=400, content={"status": "File type not allowed"})

    file_dict = select_nodes(uploaded_files)
    return {"response": file_dict, "status": "success"}

if __name__ == "__main__":
    uvicorn.run("interface:app", host="127.0.0.1", port=5000, reload=True)
