import config from './config';


const assembly = {
    name: 'NC_045512',
    aliases: ['hg38'],
    sequence: {
      type: 'ReferenceSequenceTrack',
      trackId: 'GRCh38-ReferenceSequenceTrack',
      adapter: {
        type: 'IndexedFastaAdapter',
        fastaLocation: {
          uri: `${config.REF_FA}`
        },
        faiLocation: {
          uri: `${config.REF_FAI}`

        },
      },
    }
  }

  export default assembly
  