import React, { useCallback, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FaCircle, FaRegCircle } from "react-icons/fa";

const DisplayHaplotypes = ({showUncertainNodes, search, singleSearchSpec}) => {

    const [displayNodes, setDisplayNodes] = useState(false)
    const [searched, setSearched] = useState(false)
    const searchKeys = useRef()

    const toggleDisplay = useCallback(() => {
        
        if(!searched){
          var keys = showUncertainNodes()
          
          searchKeys.current = keys
          setSearched(true)
        }else{
          if(searchKeys.current){
            
            search.setEnableUncertainNodes(searchKeys.current, !displayNodes)
          }
        }
        setDisplayNodes(!displayNodes)
        
    }, [displayNodes, search.searchesEnabled, searchKeys])

    return (
        <button onClick={toggleDisplay} style={{padding: '0 0px 0px 10px'}} aria-label="Toggle Display Mode">
          {displayNodes ? <FaCircle /> : <FaRegCircle />}
        </button>
      );
}
export default DisplayHaplotypes;