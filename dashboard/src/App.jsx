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
  const [query, updateQuery] = useQueryAsState(default_query);


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


    if (!viewState) {
      return null
  }

  return (
    <>
      <div>
          < Header/>
          <br />
            {!selectedFile ? 
              <div>
                <FileUpload setSelectedFile={setSelectedFile} createDefaultSearch={createDefaultSearch} mark_nodeRef={mark_nodeRef} queryRef={queryRef} />
              </div>
          :
         <div>
        <div style={{display:"flex", height: "92vh"}} >
          <div className="h-screen w-screen flex flex-col overflow-hidden">
            <div className="h-[calc(100%-4rem)]">
              <TaxoniumBit
                backendUrl="https://api.cov2tree.org"
                query={queryRef.current} onClickNode={onClickNode}
              />
            </div>        
        </div>
          <div className='flex' style={{margin: "10px"}}>
            {JBrowseOpen &&
            <div>
              <JBrowseLinearGenomeView viewState={viewState} />
              </div>
            }
          </div> 
        </div> 
      </div> 
      }
    </div>
  </>
);
}
export default App;
