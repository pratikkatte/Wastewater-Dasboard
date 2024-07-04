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

import {BamFile} from '@gmod/bam'


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
  const [refNames, setRefNames] = useState([]);

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


    // // or import {BamFile} from '@gmod/bam'
    
    // function readBam() {

    //   const path = require('path');

    //   console.log("readBAM")

    //   path.join(__dirname, 'example.bam');
    //   const bamPath = "../../server/app/data/SRR28230429.bam"

    //   const bam = new BamFile({
    //     path: bamPath,
    //     index: { path: `${bamPath}.bai` }
    // })
    // // // Open the BAM file
    // // var  header = await bam.getHeader()

    // // // this would get same records as samtools view ctgA:1-50000
    // // var records = await t.getRecordsForRange('ctgA', 0, 50000)

    // }

    // readBam().catch(err => console.error(err))

    // useEffect(() => {
    //   console.log("readBAM")
    //   const fetchBamData = async () => {
    //     try {
    //       const bamUrl = 'http://localhost:5000/uploads/customised_my_vcf_NODE-1.bam';
    //       const baiUrl = `${bamUrl}.bai`
          
    //       const bam = new BamFile({
    //         bamUrl,
    //         baiUrl,
    //         fetch: (url, options) => fetch(url, options).then(r => r.arrayBuffer()),
    //       });
         
    //       await bam.getHeader(); // Ensures the BAM file is loaded

    //       const records = await bam.getRecordsForRange('NC_045512v2', 100, 200);
    //      // const newReads = [];
  
    //       for (const record of records) {
    //         console.log(record._tags())
    //       //   newReads.push(`Read Name: ${record.get('name')}, Tag XX: ${record.get('XX')}`);
    //       }
  
    //       // setReads(newReads);
    //     } catch (err) {
    //       console.log(`Error reading BAM: ${err.message}`);
    //     }
    //   };
  
    //   fetchBamData();
    // }, []);
  
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
                // backendUrl="http://localhost:8080"
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
