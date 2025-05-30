

export default function makeTracks(config) {
  return [
    {
      type: "FeatureTrack",
      trackId: "nextstrain-annotations",
      name: "Genes",
      assemblyNames: [config.REF_NAME],
      category: [],
      adapter: {
        type: "FromConfigAdapter",
        features: [
          { refName:config.REF_NAME, name: "E", uniqueId: 4, start: 26244, end: 26472, fill: "#D9AD3D" },
          { refName:config.REF_NAME, name: "M", uniqueId: 5, start: 26522, end: 27191, fill: "#5097BA" },
          { refName:config.REF_NAME, name: "N", uniqueId: 10, start: 28273, end: 29533, fill: "#E67030" },
          { refName:config.REF_NAME, name: "Orf1a", uniqueId: 0, start: 265, end: 13468, fill: "#8EBC66" },
          { refName:config.REF_NAME, name: "ORF1b", uniqueId: 1, start: 13467, end: 21555, fill: "#E59637" },
          { refName:config.REF_NAME, name: "ORF3a", uniqueId: 3, start: 25392, end: 26220, fill: "#AABD52" },
          { refName:config.REF_NAME, name: "ORF6", uniqueId: 6, start: 27201, end: 27387, fill: "#DF4327" },
          { refName:config.REF_NAME, name: "ORF7a", uniqueId: 7, start: 27393, end: 27759, fill: "#C4B945" },
          { refName:config.REF_NAME, name: "ORF7b", uniqueId: 8, start: 27755, end: 27887, fill: "#75B681" },
          { refName:config.REF_NAME, name: "ORF8", uniqueId: 9, start: 27893, end: 28259, fill: "#60AA9E" },
          { refName:config.REF_NAME, name: "ORF9b", uniqueId: 11, start: 28283, end: 28577, fill: "#D9AD3D" },
          { refName:config.REF_NAME, name: "S", uniqueId: 2, start: 21562, end: 25384, fill: "#5097BA" },
        ],
      },
      displays: [
        {
          type: "LinearBasicDisplay",
          displayId: "nextstrain-color-display",
          renderer: {
            type: "SvgFeatureRenderer",
            color1: "jexl:get(feature,'fill') || 'black'",
          },
        },
      ],
    },
  ];
}
