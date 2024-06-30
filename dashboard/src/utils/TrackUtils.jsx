const addTrack = (clickedNodeRef, selectedFile, trackIDsRef, setTracks, setShowTrack, viewState, all_tracks) => {

    console.log("selectedFile", selectedFile,clickedNodeRef.current.nodeDetails.name, selectedFile[clickedNodeRef.current.nodeDetails.name].filename)
    const trackId = clickedNodeRef.current.nodeDetails.name;
    const bam_filename = selectedFile[clickedNodeRef.current.nodeDetails.name]['filename']
    const read_groupname = selectedFile[clickedNodeRef.current.nodeDetails.name]['groupname']
    const bam_location = "http://localhost:5000/uploads/"+bam_filename;
    console.log("bam_location", bam_location)
    const bami_location = bam_location + ".bai";

    const new_track_addition = {
        type: "DashboardTrack",
        trackId: trackId,
        name: clickedNodeRef.current.nodeDetails.name,
        assemblyNames: ['NC_045512'],
        category: [],
        adapter: {
            type: "DashboardAdapter",
            bamLocation: {
                uri: bam_location
            },
            index: {
                location: {
                    uri: bami_location
                },
            },
        },
        displays: [
            {
                type:'LinearDashboardDisplay',
                displayId: 'display-id'+trackId,
                groupname_tag: read_groupname
            }
        ]
    };

    if (!trackIDsRef.current.includes(trackId))
    {
        setTracks([...all_tracks, new_track_addition])
        viewState.session.addTrackConf(new_track_addition);
    
        trackIDsRef.current = [...trackIDsRef.current, trackId];
        setShowTrack(trackId);
    }
}

export default addTrack