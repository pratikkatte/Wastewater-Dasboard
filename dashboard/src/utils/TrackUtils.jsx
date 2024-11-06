const addTrack = (clickedNodeRef, selectedFile, trackIDsRef, setTracks, setShowTrack, viewState, all_tracks) => {

    // {'group1': {'filename': 'output_multi.bam', 'node_name': 'Germany/IMS-10209-CVDP-D48209F5-5BED-436E-BFC4-D2118C232BC4/2021'}, 
    // 'group2': {'filename': 'output_multi.bam', 'node_name': 'England/PHEC-Z306ZA27/2021'}}
    console.log("selectedFile", selectedFile)
    const node_name = clickedNodeRef.current.nodeDetails.name
    

    // const key = Object.keys(selectedFile).find(key => selectedFile[key].node_name === node_name);

    const read_groupname = selectedFile[node_name]['groupname']

    const unseenKey_dict = []

    selectedFile[node_name][read_groupname].forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            unseenKey_dict.push({
                "unseenKey":key, 
                "mutation":value
            })
        });
    });
    
    // const read_groupname = key

    const bam_filename = selectedFile[node_name]['filename']
    const trackId = node_name

    console.log("selectedFile", trackId, bam_filename, read_groupname, unseenKey_dict)

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
                groupname_tag: { 
                    [read_groupname]: unseenKey_dict
                }

                // groupname_tag: read_groupname
                /*
                    groupname_tag: {
                        group1: [{unseen1: "AT10:10%"}],
                        group2: [{unseen2: "GC10:20%"}]
                        }
                    }
                */
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