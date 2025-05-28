export default function makeAssembly(config) {

  console.log("config", config)
  return {
    name: config.REF_NAME || 'NC_045512',
    aliases: ['hg38'],
    sequence: {
      type: 'ReferenceSequenceTrack',
      trackId: config.REF_NAME
        ? `${config.REF_NAME}-ReferenceSequenceTrack`
        : 'GRCh38-ReferenceSequenceTrack',
      adapter: {
        type: 'IndexedFastaAdapter',
        fastaLocation: {
          uri: config.REF_FA,
        },
        faiLocation: {
          uri: config.REF_FAI,
        },
      },
    },
  };
}