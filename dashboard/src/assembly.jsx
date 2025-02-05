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
          uri: `${config.API_BASE}/api/uploads/NC_045512v2.fa`,
        },
        faiLocation: {
          uri: `${config.API_BASE}/api/uploads/NC_045512v2.fa.fai`,
        },
      },
    }
  }

  export default assembly
  