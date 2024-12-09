import axios from 'axios';
import React, { useEffect, useState } from 'react';


const FileUpload = ({setSelectedFile, createDefaultSearch, mark_nodeRef, updateQuery}) => {
  

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setisUploading] = useState(false);

  const [uploadProgress, setuploadProgress] = useState(0);

  let uploadInput = React.createRef();

    const handleFileChange = (event) => {
      const selectedFileList = []
      for (let i=0; i< event.target.files.length; i++){
        selectedFileList.push(event.target.files.item(i));
      }
      setUploadedFile(selectedFileList)
      };
    
    const handleFileUpload = async (ev) => {
      ev.preventDefault();
      setisUploading(true)

      if (!uploadedFile) {
          alert('Please select a file first');
          return;
        }
        const data = new FormData()

        for (let i =0; i < uploadInput.files.length; i++){
          data.append("file", uploadInput.files[i], uploadInput.files[i].name)
        }
        try {
          const config = {
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              setuploadProgress(Math.round((loaded / total) * 100));
            },
          };
          const response = await axios.post(
            "/api/upload",
            data,
            config,
          );
          
          console.log("response", response)
          if (response.status === 200) {
            
            setisUploading(false)
            const selected_nodes = response.data.response
            console.log("selected_nodes", selected_nodes)

            handleFileProcessing(selected_nodes)
            console.log("file uploaded")
          }
          if (response.status == 400 ){
            console.log(response)
            alert(response.status)
          }
        }catch (error){
          setisUploading(false)
          console.log("error", error)
          if (error.response.status == 400){
            alert(error.response.data.status)
          }
          else {
            alert(error.response.statusText)
          }            
      }
    };

      const handleFileProcessing = (filenames_nodes) => {
      
        // const nodes = Object.keys(filenames_nodes);

        // const nodes = filenames_nodes.map(groupName => fileDict[groupName].node_name);

        const nodes = Object.keys(filenames_nodes);
        console.log("nodes", nodes)
        mark_nodeRef.current = nodes;
        
        const default_search = createDefaultSearch(nodes);
    
        const zoom_to_indexes = [];
        for (let i = 0; i < nodes.length; i++) {
            zoom_to_indexes.push(i.toString());
        }
        const query = {
              srch: JSON.stringify(default_search),
              enabled: JSON.stringify(Object.fromEntries(default_search.map(value => [value.key, true]))),
              backend: "",
              xType: "x_dist",
              zoomToSearch: zoom_to_indexes,
              mutationTypesEnabled: JSON.stringify({ aa: true, nt: false }),
              treenomeEnabled: false,
          };
        updateQuery(query)
        setSelectedFile(filenames_nodes);
    }

    return (
        <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', maxWidth: '90%', margin: '0 auto'  }}>
            <p style={{ textAlign: 'center', margin: '20px 0', fontSize: '16px', color: '#333', maxWidth:'90%',margin: '10px auto' }}>
                This dashboard provides insights into the genomic data by using BAM files of the sequenced waste water samples, 
                allowing for the monitoring and analysis of viral strains present in the community.
            </p>
      
            <div className='flex' style={{ justifyContent: "center", alignItems: "center", margin: '30px auto'}}>
                <input type="file" ref={(ref) => {
                  uploadInput = ref;
                }} 
                onChange={handleFileChange} style={{ padding: '10px', margin: '5px', border: '1px solid #ccc', borderRadius: '5px' }} multiple />
                <button onClick={handleFileUpload} style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Upload</button>
                {isUploading && (
            <>
            <p>{uploadProgress}%</p>
            {/* <CircularProgress value={uploadProgress} thickness="12px">
              <CircularProgressLabel>{uploadProgress}%</CircularProgressLabel>
            </CircularProgress> */}
            </>
        )}
                <br/>
            </div>
           
        </div>

      );
  };

  export default FileUpload
