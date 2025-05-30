
export default function makeSession(config, tracks) {
  console.log("default session", config, tracks)
  
  return {
    id:"session-id",
    name:"this session",
    margin: 0,
    drawerPosition: "right",
    drawerWidth: 384,
    widgets: {},
    activeWidgets: {},
    minimized: false,
    connectionInstances: [],
    sessionTracks: [],
    view: {
      id: "linearGenomeView",
      minimized: false,
      type: "LinearGenomeView",
      offsetPx: 0,
      bpPerPx: 1,
      displayedRegions: [
        {
          "refName":config.REF_NAME,
          "start":config.START,
          "end":config.END,
          reversed: false,
          "assemblyName":config.REF_NAME,
        }
      ],
      tracks:tracks,
      hideHeader: false,
      hideHeaderOverview: false,
      hideNoTracksActive: false,
      trackSelectorType: "hierarchical",
      showCenterLine: false,
      showCytobandsSetting: true,
      trackLabels: "offset",
      showGridlines: true,
    }
  };
}