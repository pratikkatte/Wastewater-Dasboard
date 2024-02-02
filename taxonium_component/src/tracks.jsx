const tracks = [
    {
      type: 'AlignmentsTrack',
      trackId: 'genes',
      name: 'spike-in_bams_file_0.bam',
      assemblyNames: ['NC_045512'],
      category: ['Genes'],
      adapter: {
        type: 'BamAdapter',
        bamLocation: {
          uri: 'spike-in_bams_file_0.bam',
        },
        index: {
          location: {
            uri: 'spike-in_bams_file_0.bam.bai',
          },
        },
      }
  }
  ]
  
  export default tracks