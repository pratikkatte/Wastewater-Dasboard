import { BamFile } from '@gmod/bam'
import {
  BaseFeatureDataAdapter,
  BaseOptions,
} from '@jbrowse/core/data_adapters/BaseAdapter'
import { Region } from '@jbrowse/core/util/types'
import QuickLRU from '@jbrowse/core/util/QuickLRU'
import { bytesForRegions, updateStatus, Feature } from '@jbrowse/core/util'
import { openLocation } from '@jbrowse/core/util/io'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import { toArray } from 'rxjs/operators'
import { firstValueFrom } from 'rxjs'
import { checkStopToken } from '@jbrowse/core/util/stopToken'

// locals
import BamSlightlyLazyFeature from './BamSlightlyLazyFeature'
import { IFilter } from '../shared'

interface Header {
  idToName: string[]
  nameToId: Record<string, number>
}

export default class BamAdapter extends BaseFeatureDataAdapter {
  private samHeader?: Header

  private setupP?: Promise<Header>

  // used for avoiding re-creation new BamSlightlyLazyFeatures, keeping
  // mismatches in cache. at an average of 100kb-300kb, keeping even just 500
  // of these in memory is memory intensive but can reduce recomputation on
  // these objects
  private ultraLongFeatureCache = new QuickLRU({
    maxSize: 500,
  })
  
  private configureP?: Promise<{
    bam: BamFile
    sequenceAdapter?: BaseFeatureDataAdapter
  }>

  // derived classes may not use the same configuration so a custom
  // configure method allows derived classes to override this behavior
  protected async configurePre() {
    const bamLocation = this.getConf('bamLocation')
    const location = this.getConf(['index', 'location'])
    const indexType = this.getConf(['index', 'indexType'])
    const pm = this.pluginManager
    const csi = indexType === 'CSI'
    const bam = new BamFile({
      bamFilehandle: openLocation(bamLocation, pm),
      csiFilehandle: csi ? openLocation(location, pm) : undefined,
      baiFilehandle: !csi ? openLocation(location, pm) : undefined,

      // chunkSizeLimit and fetchSizeLimit are more troublesome than
      // helpful, and have given overly large values on the ultra long
      // nanopore reads even with 500MB limits, so disabled with infinity
      yieldThreadTime: Number.POSITIVE_INFINITY,
    })

    const adapterConfig = this.getConf('sequenceAdapter')
    if (adapterConfig && this.getSubAdapter) {
      const { dataAdapter } = await this.getSubAdapter(adapterConfig)
      return {
        bam,
        sequenceAdapter: dataAdapter as BaseFeatureDataAdapter,
      }
    } else {
      return { bam }
    }
  }

  protected async configure() {
    if (!this.configureP) {
      this.configureP = this.configurePre().catch(e => {
        this.configureP = undefined
        throw e
      })
    }
    return this.configureP
  }

  async getHeader(opts?: BaseOptions) {
    const { bam } = await this.configure()
    return bam.getHeaderText()
  }

  private async setupPre(opts?: BaseOptions) {
    const { statusCallback = () => {} } = opts || {}
    const { bam } = await this.configure()
    this.samHeader = await updateStatus(
      'Downloading index',
      statusCallback,
      async () => {
        const samHeader = await bam.getHeader()

        // use the @SQ lines in the header to figure out the
        // mapping between ref ref ID numbers and names
        const idToName: string[] = []
        const nameToId: Record<string, number> = {}
        samHeader
          ?.filter(l => l.tag === 'SQ')
          .forEach((sqLine, refId) => {
            const SN = sqLine.data.find(item => item.tag === 'SN')
            if (SN) {
              // this is the ref name
              const refName = SN.value
              nameToId[refName] = refId
              idToName[refId] = refName
            }
          })

        return { idToName, nameToId }
      },
    )
    return this.samHeader
  }

  async setup(opts?: BaseOptions) {
    if (!this.setupP) {
      this.setupP = this.setupPre(opts).catch(e => {
        this.setupP = undefined
        throw e
      })
    }
    return this.setupP
  }

  async getRefNames(opts?: BaseOptions) {
    const { idToName } = await this.setup(opts)
    return idToName
  }

  private async seqFetch(refName: string, start: number, end: number) {
    const { sequenceAdapter } = await this.configure()
    const refSeqStore = sequenceAdapter
    if (!refSeqStore) {
      return undefined
    }
    if (!refName) {
      return undefined
    }

    const features = refSeqStore.getFeatures({
      refName,
      start,
      end,
      assemblyName: '',
    })

    const seqChunks = await firstValueFrom(features.pipe(toArray()))

    let sequence = ''
    seqChunks
      .sort((a, b) => a.get('start') - b.get('start'))
      .forEach(chunk => {
        const chunkStart = chunk.get('start')
        const chunkEnd = chunk.get('end')
        const trimStart = Math.max(start - chunkStart, 0)
        const trimEnd = Math.min(end - chunkStart, chunkEnd - chunkStart)
        const trimLength = trimEnd - trimStart
        const chunkSeq = chunk.get('seq') || chunk.get('residues')
        sequence += chunkSeq.slice(trimStart, trimStart + trimLength)
      })

    if (sequence.length !== end - start) {
      throw new Error(
        `sequence fetch failed: fetching ${refName}:${(
          start - 1
        ).toLocaleString()}-${end.toLocaleString()} returned ${sequence.length.toLocaleString()} bases, but should have returned ${(
          end - start
        ).toLocaleString()}`,
      )
    }
    return sequence
  }

  getFeatures(
    region: Region & { originalRefName?: string },
    opts?: BaseOptions & {
      filterBy: IFilter
    },
  ) {

    const MAX_FEATURES = 40000

    const { refName, start, end, originalRefName } = region
    const { stopToken, filterBy, statusCallback = () => {} } = opts || {}
    
    return ObservableCreate<Feature>(async observer => {

      const { bam } = await this.configure()
      await this.setup(opts)
      checkStopToken(stopToken)
      const records = await updateStatus(
        'Downloading alignments',
        statusCallback,
        () => bam.getRecordsForRange(refName, start, end),
      )
      checkStopToken(stopToken)
      await updateStatus('Processing alignments', statusCallback, async () => {

        const {
          flagInclude = 0,
          flagExclude = 0,
          tagFilter,
          readName,
          filterReads
        } = filterBy || {}

        const stride = Math.ceil(records.length / MAX_FEATURES)

        for (let i = 0; i < records.length; i += stride) {
          if (stride > 1 && i % stride !== 0) continue // skip

          const record = records[i]
          let ref: string | undefined
          let unseen_mutations = {}

          if (!record.tags.MD) {
            ref = await this.seqFetch(
              originalRefName || refName,
              record.start,
              record.end,
            )
          }

          const flags = record.flags
          if ((flags & flagInclude) !== flagInclude && !(flags & flagExclude)) {
            continue
          }

          if (tagFilter && tagFilter.tag) {
            // const v = record.get(tagFilter.tag)
            const v = record.tags[tagFilter.tag]

            if (
              !(tagFilter.value === '*'
                ? v !== undefined
                : `${v}`.split(',').includes(tagFilter.value)
            )) {
              continue
            }
          }

          const um_filter =
                tagFilter?.value && filterReads[tagFilter.value]
                  ? filterReads[tagFilter.value].map((item) => item.unseenKey)
                  : [];
          

          if(um_filter.length>0) {
                        
            var um = record.tags.UM ? record.tags.UM : ''
            um = um.split(",")

            
            if (!um || !um.some(u => um_filter.includes(u))) {
                continue
            }
          }

          if (readName && record.get('name') !== readName) {
            continue
          }


          const ret = this.ultraLongFeatureCache.get(`${record.id}`)
          if (!ret) {
            const elt = new BamSlightlyLazyFeature(record, this, ref)
            this.ultraLongFeatureCache.set(`${record.id}`, elt)
            observer.next(elt)
          } else {
            observer.next(ret)
          }
          // observer.next(new BamSlightlyLazyFeature(record, this, ref))
        }
        observer.complete()
      })
    })
  }

  async getMultiRegionFeatureDensityStats(
    regions: Region[],
    opts?: BaseOptions,
  ) {
    const { bam } = await this.configure()
    // this is a method to avoid calling on htsget adapters
    if (bam.index) {
      const bytes = await bytesForRegions(regions, bam)
      const fetchSizeLimit = this.getConf('fetchSizeLimit')
      return { bytes, fetchSizeLimit }
    } else {
      return super.getMultiRegionFeatureDensityStats(regions, opts)
    }
  }

  freeResources(/* { region } */): void {}

  // depends on setup being called before the BAM constructor
  refIdToName(refId: number) {
    return this.samHeader?.idToName[refId]
  }
}