const addTrack = (clickedNodeRef, selectedFile, trackIDsRef, setTracks, setShowTrack, viewState, all_tracks) => {

    console.log("selectedFile", clickedNodeRef.current.nodeDetails.name)
    const trackId = clickedNodeRef.current.nodeDetails.name + "sdaasd";
    const bam_location = "http://localhost:5000/static/data/"+selectedFile[clickedNodeRef.current.nodeDetails.name];
    console.log("bam_location", bam_location)
    const bami_location = bam_location + ".bai";

    const new_track_addition = {
        type: "AlignmentsTrack",
        trackId: trackId,
        name: 'bamfile-name-' + clickedNodeRef.current.nodeDetails.name,
        assemblyNames: ['NC_045512'],
        category: [],
        adapter: {
            type: "BamAdapter",
            bamLocation: {
                uri: bam_location
            },
            index: {
                location: {
                    uri: bami_location
                },
            },
        }
    };

    if (!trackIDsRef.current.includes(trackId))
    {
        setTracks([...all_tracks, new_track_addition])
        viewState.session.addTrackConf(new_track_addition);
    
        trackIDsRef.current = [...trackIDsRef.current, trackId];
        setShowTrack(trackId);
    }

    // return new_track_addition;
}

export default addTrack