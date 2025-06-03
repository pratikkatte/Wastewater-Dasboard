
const addTrack = (clickedNodeRef, selectedFile, trackIDsRef, viewState, config) => {
    if (!viewState || !viewState.session || !viewState.session.view) return;

    const node_name = clickedNodeRef.current.nodeDetails.name


    const read_groupname = selectedFile[node_name]['groupname']

    const uncertain_nodes = selectedFile[node_name]['UH']

    const unseenKey_dict = []

    const all_group_name = {}
    Object.entries(selectedFile).forEach(([node_name, read_groups]) => {
        all_group_name[read_groups['groupname']] = node_name
    })

    selectedFile[node_name][read_groupname].forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            unseenKey_dict.push({
                "unseenKey":key, 
                "mutation":value
            })
        });
    });
    

    const bam_filename = selectedFile[node_name]['filename']
    const trackId = node_name

    const bam_location = `${config.BAM}${bam_filename}`
    const bami_location = bam_location + ".bai";
    
    const new_track_addition = {
        type: "DashboardTrack",
        trackId: trackId,
        name: "Reads mapping to "+clickedNodeRef.current.nodeDetails.name,
        assemblyNames: [config.REF_NAME],
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
                },
                all_group_name : all_group_name,
                uncertain_nodes: []
            }
        ]
    };


    const haplotype_sequences = selectedFile['HP_SEQ']['filename']

    const hap_location = `${config.BAM}${haplotype_sequences}`;
    
    const hapi_location = hap_location + ".bai";

    const haplotype_trackid = "sequenceid-"+read_groupname

    const haplotype_track = {

        type: "DashboardTrack",
        trackId: haplotype_trackid,
        name: "sequence-"+clickedNodeRef.current.nodeDetails.name,
        assemblyNames: [config.REF_NAME],
        category: [],
        adapter: {
            type: "DashboardAdapter",
            bamLocation: {
                uri: hap_location
            },
            index: {
                location: {
                    uri: hapi_location
                },
            },
        },
        displays: [
            {
                type:'LinearDashboardDisplay',
                displayId: 'sequence-display-id'+"haplotype_track"+read_groupname,
                groupname_tag: {
                    [read_groupname]: unseenKey_dict
                },
                all_group_name : all_group_name,
                uncertain_nodes: uncertain_nodes
            }
        ]
    }

    if (!trackIDsRef.current.includes(trackId))
    {

        viewState.session.addTrackConf(haplotype_track);
        viewState.session.addTrackConf(new_track_addition);

        viewState.session.view.showTrack(haplotype_trackid);
        viewState.session.view.showTrack(trackId);

        trackIDsRef.current = [...trackIDsRef.current, haplotype_trackid, trackId];

    }
    else {
        viewState.session.view.showTrack(haplotype_trackid);
        viewState.session.view.showTrack(trackId);
    }
}

export default addTrack