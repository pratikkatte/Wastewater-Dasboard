import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FaCircle, FaRegCircle } from "react-icons/fa";

const DisplayHaplotypes = () => {

    const [displayNodes, setDisplayNodes] = useState(false)

    const toggleDisplay = () => {
        setDisplayNodes(!displayNodes)
        console.log("clicked", displayNodes)
    }

    return (
        <button onClick={toggleDisplay} style={{padding: '0 0px 0px 10px'}} aria-label="Toggle Display Mode">
          {displayNodes ? <FaCircle /> : <FaRegCircle />}
        </button>
      );
}
export default DisplayHaplotypes;