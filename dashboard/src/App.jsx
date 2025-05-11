import React, { useState, Suspense, useRef, useEffect, useCallback } from "react";
import TaxoniumBit from "./components/TaxoniumBit";
import { getDefaultSearch } from "./utils/searchUtil.js";

import tracks from './tracks.jsx';
import assembly from './assembly.jsx';
import defaultSession from './defaultSession.jsx'
import addTrack  from './utils/TrackUtils.jsx'
import { Header } from './utils/UIUtils.jsx'
import FileUpload from './utils/uploadUtils.jsx'
import DashboardPlugin from './plugins'
import config from './config';
import SplitPane from 'react-split-pane';
import { MdArrowBack, MdArrowForward, MdArrowUpward } from "react-icons/md";

// import 'react-split-pane/lib/styles.css';
import './App.css'




import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view'

const default_query = {};

default_query.backend = null;


const createDefaultSearch = (mark_nodes, hap_lin, unc_nodes) => {
  
  return Object.keys(mark_nodes).map(node => {
    return getDefaultSearch(null, node, mark_nodes[node], hap_lin[node], unc_nodes[node]);
  })
}

function App() {
  // Import taxonium-component
  useEffect(() => {
    import("taxonium-component");
  }, []);

  const [viewState, setViewState] = useState();
  const [all_tracks, setTracks] = useState([])
  const [showTrack, setShowTrack] = useState(null)
  const clickedNodeRef = useRef(null);
  const mark_nodeRef = useRef(null);
  const trackIDsRef = useRef([]);
  const [createTract, setCreateTrack] = useState(null)
  const [JBrowseOpen, setJBrowseOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(false);
  const [uploadProgress, setuploadProgress] = useState(0);
  const [paneSize, setPaneSize] = useState('98%');

  // const [query, updateQuery] = useState(default_query);
  
  const [patches, setPatches] = useState();
  
  const [backupQuery, setBackupQuery] = useState(default_query);
  const backupUpdateQuery = useCallback((newQuery) => {
    setBackupQuery((oldQuery) => ({ ...oldQuery, ...newQuery }));
  }, []);
  
  const query = backupQuery; // query
  const updateQuery = backupUpdateQuery;

  const [refNames, setRefNames] = useState([]);

  // const toggleJBrowse = () => {
  //   setJBrowseOpen(!JBrowseOpen);
  //   setPaneSize(prev => (JBrowseOpen ? '1%' : '30%'));
  // };

  const toggleJBrowse = useCallback((input_jbrowse) => {
    setJBrowseOpen(() => {
      // const newState = !prev;
      const newState = input_jbrowse
      // setLeftPaneSize(newState ? '70%' : '90%'); // expand left when hidden
      setPaneSize(newState ? '60%' : '98%');
      return newState;
    });
  }, [JBrowseOpen]);

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
    setCreateTrack(false);
  }, [createTract])

  useEffect(() => {
    if(showTrack)
    {
        // trackIDsRef.current.forEach((trackId) => {
        // viewState.session.view.showTrack(trackId);
        // })
        viewState.session.view.showTrack(showTrack);

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
            // setJBrowseOpen(true);
            toggleJBrowse(true)

          }

    }, [JBrowseOpen]);


    useEffect(() => {
      const handlePopState = () => {
        if (selectedFile) {
          const confirmLeave = window.confirm(
            "Do you want to leave and lose this session?"
          );
          if (!confirmLeave) {
            // 👇 Push a new dummy state again to intercept future back presses
            window.history.pushState(null, '', window.location.href);
          }
        }
      };
    
      // Initial trap
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);
    
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }, [selectedFile]);    

    if (!viewState) {
      return null
  }

  return (
    <>

      <div className="flex flex-col h-screen ">
          < Header/>
          <br />
            {!selectedFile ? 
              <div>
                <FileUpload setSelectedFile={setSelectedFile} createDefaultSearch={createDefaultSearch} mark_nodeRef={mark_nodeRef} updateQuery={updateQuery}/>
              </div>
              
          :
                <SplitPane
                  split="vertical"
                  minSize={0}
                  // defaultSize="70%"
                  size={paneSize}

                  style={{ height: "100vh" }}
                  >
                    {/* Left Pane: TaxoniumBit */}
                    <div className="h-full w-full flex flex-col overflow-hidden">
                    <TaxoniumBit
                      backendUrl={`${config.TAXONIUM_BASE}`}
                      query={query}
                      updateQuery={updateQuery}
                      onClickNode={onClickNode}
                    />
                </div>

          {/* Right Pane: JBrowse */}
          <div className="h-full w-full overflow-auto jbrowse-display">
            <button
            onClick={() => toggleJBrowse(!JBrowseOpen)}
            className="jbrowse-toggle"
            style={{
              display:'flex',
              marginLeft: !JBrowseOpen ? 'auto' : 'inherit',
            }}
          >
            {JBrowseOpen ? <MdArrowForward/> : <MdArrowBack/>}
          </button>
          {JBrowseOpen && (
       
            <JBrowseLinearGenomeView viewState={viewState}/>
          )}
          </div>
        </SplitPane>
      }
    </div>

  </>
);
}
export default App;