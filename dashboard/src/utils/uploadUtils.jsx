import axios from 'axios';
import React, { useEffect, useState } from 'react';


const FileUpload = ({setSelectedFile, createDefaultSearch, mark_nodeRef, updateQuery, setuploadProgress}) => {
  

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setisUploading] = useState(false);

  
  const [message, setMessage] = useState('')
  let uploadInput = React.createRef();

    
    const handleFileChange = (event) => {
      setUploadedFile(Array.from(event.target.files)); 
    };
    const handleFileUpload = () => {
      // ev.preventDefault();
      setisUploading(true)

      if (!uploadedFile) {
          alert('Please select a file first');
          return;
        }
      const worker = new Worker(new URL('./uploadWorker.js', import.meta.url));
      worker.onmessage = function(event) {
        if (event.data.progress !== undefined) {
          setuploadProgress(event.data.progress);
        } else if (event.data.message) {
            setMessage(event.data.message);
            const selected_nodes = event.data.data.response
            handleFileProcessing(selected_nodes)
        } else if (event.data.error) {
            setMessage(event.data.error);
        }
    };

    worker.postMessage({uploadedFile});
    };

      const handleFileProcessing = (filenames_nodes) => {
      
        // const nodes = Object.keys(filenames_nodes);
        console.log("filename_nodes", filenames_nodes)
        // const nodes = filenames_nodes.map(groupName => fileDict[groupName].node_name);
        const nodes = Object.keys(filenames_nodes).map(key => filenames_nodes[key].node_name);
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
            {/* <p>{uploadProgress.toFixed(1)}%</p> */}
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
