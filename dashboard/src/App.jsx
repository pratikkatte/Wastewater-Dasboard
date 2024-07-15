import React, { useState, Suspense, useRef, useEffect, useCallback } from "react";
import AboutOverlay from "./components/AboutOverlay";
import TaxoniumBit from "./components/TaxoniumBit";
import { getDefaultSearch } from "./utils/searchUtil.js";
import useQueryAsState from "./hooks/useQueryAsState";

import tracks from './tracks.jsx';
import assembly from './assembly.jsx';
import defaultSession from './defaultSession.jsx'
import addTrack  from './utils/TrackUtils.jsx'
import { Header } from './utils/UIUtils.jsx'
import FileUpload from './utils/uploadUtils.jsx'
import DashboardPlugin from './plugins'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view'

const default_query = {};

default_query.backend = null;

const createDefaultSearch = (mark_nodes) => {
  return mark_nodes.map(node => {
    return getDefaultSearch(null, node);
  })
}

function App() {
  // Import taxonium-component
  useEffect(() => {
    import("taxonium-component");
  }, []);

  const [viewState, setViewState] = useState();
  const [all_tracks, setTracks] = useState([])
  const [patches, setPatches] = useState();
  const [showTrack, setShowTrack] = useState(null)

  const clickedNodeRef = useRef(null);
  const queryRef = useRef(null);
  const mark_nodeRef = useRef(null);
  const trackIDsRef = useRef([]);

  const [createTract, setCreateTrack] = useState(null)

  const [JBrowseOpen, setJBrowseOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(false);
  const [uploadProgress, setuploadProgress] = useState(0);
  // const [query, updateQuery] = useState(default_query);

  const [backupQuery, setBackupQuery] = useState(default_query);
  const backupUpdateQuery = useCallback((newQuery) => {
    setBackupQuery((oldQuery) => ({ ...oldQuery, ...newQuery }));
  }, []);
  
  const query = backupQuery; // query
  const updateQuery = backupUpdateQuery;

  const [refNames, setRefNames] = useState([]);


  const toggleJBrowse = () => {
    setJBrowseOpen(!JBrowseOpen);
  };

  useEffect(() => {
    const state = createViewState({
      assembly,
      tracks: tracks,
      defaultSession,
      plugins:[
        DashboardPlugin
        ],
      onChange: patch => {
        setPatches(previous => previous + JSON.stringify(patch) + '\n')
      },
    })
    setViewState(state)
  }, []);

useEffect(() => {
  if(createTract){
      addTrack(clickedNodeRef, 
        selectedFile, 
        trackIDsRef, 
        setTracks, 
        setShowTrack, 
        viewState, all_tracks);
      }      
  }, [createTract])

  useEffect(() => {
    if(showTrack)
    {
        trackIDsRef.current.forEach((trackId) => {
        viewState.session.view.showTrack(trackId);
        })
        setShowTrack(null)
        setCreateTrack(false);
    }
    }, [showTrack])

    const onClickNode = useCallback((selectedNode) => {
    if ( selectedNode && mark_nodeRef.current.includes(selectedNode.nodeDetails.name)){
            // addTrack(showTrack.trackID, showTrack.bam_location, showTrack.bami_location)
            clickedNodeRef.current = selectedNode
            selectedNode.clearNodeDetails()
            // addTrack();
            setCreateTrack(true);
            setJBrowseOpen(true);
    }
    }, [JBrowseOpen]);

    // const onbuttonclick = useCallback(() => {
    //   console.log("button clicked")
    //   const prev_nodes = Object.keys(selectedFile);
    //   const additional_nodes = ["England/PHEC-3V07BV6F/2021"];
    //   const nodes = [...prev_nodes, ...additional_nodes]
      
    //     mark_nodeRef.current = nodes;
    //     const default_search = createDefaultSearch(nodes);
    
    //     const zoom_to_indexes = [];
    //     for (let i = 0; i < nodes.length; i++) {
    //         zoom_to_indexes.push(i.toString());
    //     }
    //     const query = {
    //           srch: JSON.stringify(default_search),
    //           enabled: JSON.stringify(Object.fromEntries(default_search.map(value => [value.key, true]))),
    //           backend: "",
    //           xType: "x_dist",
    //           zoomToSearch: zoom_to_indexes,
    //           mutationTypesEnabled: JSON.stringify({ aa: true, nt: false }),
    //           treenomeEnabled: false,
    //       };
    //   updateQuery(query)
    // })

    if (!viewState) {
      return null
  }
  return (
    <>
      <div>
        <div>
        </div>
          < Header/>
          <br />
            {!(uploadProgress>10)? 
              <div>
                <FileUpload setSelectedFile={setSelectedFile} createDefaultSearch={createDefaultSearch} mark_nodeRef={mark_nodeRef} updateQuery={updateQuery} setuploadProgress={setuploadProgress} />
              </div>
          :
         <div>
        <div style={{display:"flex", height: "90vh"}} >
          <div className="h-screen w-screen flex flex-col overflow-hidden">
            <div className="h-[calc(95%-4rem)]">
              <TaxoniumBit
                // backendUrl="http://localhost:8080"
                backendUrl="https://api.cov2tree.org"
                query={query} updateQuery={updateQuery} onClickNode={onClickNode}
              />
            </div>        
        </div>
        <div className='flex' style={{ margin: "10px", position: "relative" }}>
          <button 
                onClick={toggleJBrowse} 
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  zIndex: 10, 
                  backgroundColor: 'white', 
                  border: 'none', 
                  cursor: 'pointer' 
                }}
              >
                {JBrowseOpen ? <FaArrowRight /> : <FaArrowLeft />}
              </button>
            {JBrowseOpen &&
            <div>
              <JBrowseLinearGenomeView viewState={viewState} />
            </div>
            }
          </div> 
        </div> 
      </div> 
      }
      {(uploadProgress<100)? 
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ flexBasis: `${uploadProgress}%` }}></div>
      </div>
      :
      <>
      </>
      } 
    </div>
  </>
);
}
export default App;
