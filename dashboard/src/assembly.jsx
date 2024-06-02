const assembly = {
    name: 'NC_045512',
    aliases: ['hg38'],
    sequence: {
      type: 'ReferenceSequenceTrack',
      trackId: 'GRCh38-ReferenceSequenceTrack',
      adapter: {
        type: 'IndexedFastaAdapter',
        fastaLocation: {
          uri: 'http://localhost:5000/uploads/refsequences.fasta',
        },
        faiLocation: {
          uri: 'http://localhost:5000/uploads/refsequences.fasta.fai',
        },
      },
    }
  }

  export default assembly
  