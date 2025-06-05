import React, { useCallback, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { Button } from "../components/Basic";


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
        <span onClick={toggleDisplay} style={{padding: '0 0px 0px 10px'}} aria-label="Toggle Display Mode">
          {displayNodes ? <Button
                  className="inline-block bg-gray-100 text-xs mx-auto h-5 rounded border-gray-300 border  text-gray-700 "
                  title="hide uncertain nodes"
                  >
                    <FaCircle />
                  </Button> : 
                  <Button
                  className="inline-block bg-gray-100 text-xs mx-auto h-5 rounded border-gray-300 border  text-gray-700 "
                  title="show uncertain nodes"
                  >
                  <FaRegCircle />
                  </Button>
                  }
        </span>
      );
}
export default DisplayHaplotypes;