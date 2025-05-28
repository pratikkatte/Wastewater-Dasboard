import axios from 'axios';
import React, { useEffect, useState } from 'react';


const referenceOptions = [
  "NC_038235.1",
  "NC_045512v2",
  "NC_045512.2"
];

const FileUpload = ({setSelectedFile, createDefaultSearch, mark_nodeRef, updateQuery, config, setProjectName}) => {
  
  const [selectedReference, setSelectedReference] = useState("NC_045512v2");

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [uploadProgress, setuploadProgress] = useState(0);

  const [results, setResults] = useState(null);


  useEffect(()=> {
    if(results==null){
      console.log("config", `${config.PROJECTS}`)
      axios.post(`${config.PROJECTS}`)
        .then((response) => {
      console.log("result", response.data.results)
      setResults(response.data.results);
    })
    .catch((error) => {
      console.error("Error fetching results", error);
    });
    }
  }, [results])

  let uploadInput = React.createRef();
    const handleFileChange = (event) => {
      setUploadedFile(Array.from(event.target.files))
      };
    
    const handleFileUpload = async (ev) => {
      ev.preventDefault();
      setUploading(true)

      if (!uploadedFile) {
          alert('Please select a file first');
          return;
        }
        const data = new FormData()

        uploadedFile.forEach(file => data.append('files', file)); // key must match 'files'
        data.append('reference_file', selectedReference); 


       try {
          const p_config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              setuploadProgress(Math.round((loaded / total) * 100));
            },
          };
          console.log(`server url ${config.UPLOAD}`)
          const response = await axios.post(
            `${config.UPLOAD}`,
            data,
            p_config,
          );
          
          console.log("response", response)
          if (response.status === 200) {
            
            setUploading(false)
            const selected_nodes = response.data.response
          
            var project_config = response.data.config

            setProjectName(project_config)

            handleFileProcessing(selected_nodes)
          }
          if (response.status == 400 ){
            console.log(response)
            alert(response.status)
          }
        }catch (error){
          setUploading(false);
          console.log("error", error);
        
          if (error.response) {
            if (error.response.status == 400) {
              alert(error.response.data.status);
            } else {
              alert(error.response.statusText);
            }
          } else {
            alert('Network error or CORS error');
          }
      }
    };

    const handleResultsClick = async (idx) => {
      const tax_loaded = true;

  
        
        setLoading(true);
        console.log("load url", `${config.LOAD_TAX}${results[idx]}`);
        
        try {
          const response =  await axios.get(`${config.LOAD_TAX}${results[idx]}`);
          if (response.status === 200) {
            console.log("load tax", response);
            setLoading(false);  
          } else {
            console.log("error", response);
            setLoading(false);
          }
        } catch (error) {
          console.log("axios error", error);
          setLoading(false);
        }

        if(tax_loaded){
          try {
            console.log("moving forward")
            const response =  await axios.post(
                  `${config.RESULT}${results[idx]}`
            )
            console.log('response', response)
    
            if (response.status === 200) {
              const selected_nodes = response.data.response
              var project_config = response.data.config
    
              console.log("config updating",project_config )
              setProjectName(project_config)
              handleFileProcessing(selected_nodes)
            }
            if (response.status == 400 ){
              console.log(response)
              alert(response.status)
            }
          } catch (error){
            console.log("result error", error)
          }  
        }
        
    }
    
      const handleFileProcessing = (filenames_nodes) => {

        const keysToExclude = ['HP_SEQ']; // replace 'key1', 'key2' with actual keys
        // Filter out the keys to exclude
        const nodes = Object.keys(filenames_nodes).filter(key => !keysToExclude.includes(key));
        
        mark_nodeRef.current = nodes;

        const haplotype_prop = {}
        const haplotype_lineage = {}
        const uncertain_nodes = {}
    
        const zoom_to_indexes = [];
        for (let i = 0; i < nodes.length; i++) {
            zoom_to_indexes.push(i.toString());
            haplotype_prop[nodes[i]] = filenames_nodes[nodes[i]]['HS']
            haplotype_lineage[nodes[i]] = filenames_nodes[nodes[i]]['HL']
            uncertain_nodes[nodes[i]] = filenames_nodes[nodes[i]]['UH']
        }
        const default_search = createDefaultSearch(haplotype_prop, haplotype_lineage, uncertain_nodes);

        const query = {
              srch: JSON.stringify(default_search),
              enabled: JSON.stringify(Object.fromEntries(default_search.map(value => [value.key, true]))),
              backend: "",
              xType: "x_dist",
              zoomToSearch: zoom_to_indexes,
              mutationTypesEnabled: JSON.stringify({ aa: true, nt: true }),
              treenomeEnabled: false,
          };
        updateQuery(query)
        setSelectedFile(filenames_nodes);
    }
    
    return (
      <div style={{maxWidth: '90%', margin: '0 auto'  }}>

        <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
            <p style={{ textAlign: 'center', margin: '20px 0', fontSize: '16px', color: '#333', maxWidth:'90%',margin: '10px auto' }}>
                This dashboard provides insights into the genomic data by using BAM files of the sequenced waste water samples, 
                allowing for the monitoring and analysis of viral strains present in the community.
            </p>

            <div className='flex' style={{ justifyContent: "center", alignItems: "center", margin: '30px auto'}}>
                <input type="file" ref={(ref) => {
                  uploadInput = ref;
                }} 
                onChange={handleFileChange} style={{ padding: '10px', margin: '5px', border: '1px solid #ccc', borderRadius: '5px' }} multiple />
                <button 
                  disabled={uploading}
                  onClick={handleFileUpload} 
                  style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Upload</button>
                {uploading && (
            <p>{uploadProgress}%</p>

        )}
                <br/>
            </div>
        </div>   
        {results && results.length>0 && (
          <div className="flex flex-col space-y-3 pt-6">
            <div className="flex flex-row items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="px-2 text-gray-500 text-sm">results</div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <div className="flex flex-row space-x-4 mt-6">
            {results.map((result, index) => (
              <button
                key={index}
                style={{
                  background: '#f20f0f0',
                  padding: '20px',
                  borderRadius: '5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  minWidth: '120px',   // makes buttons a decent width
                  border: '1px solid gray',
                  textAlign: 'center'
                }}
                onClick={() => handleResultsClick(index)}
                >
                {result}
              </button>
            ))}
            </div>
            </div>
          )}
          </div>
        );
      };

  export default FileUpload
