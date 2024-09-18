const addTrack = (clickedNodeRef, selectedFile, trackIDsRef, setTracks, setShowTrack, viewState, all_tracks) => {

    const node_name = clickedNodeRef.current.nodeDetails.name
    const key = Object.keys(selectedFile).find(key => selectedFile[key].node_name === node_name);
    const read_groupname = key

    const bam_filename = selectedFile[key]['filename']
    const trackId = node_name

    console.log("selectedFile", trackId, bam_filename, read_groupname)

    const bam_location = "http://localhost:5000/uploads/"+bam_filename;
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