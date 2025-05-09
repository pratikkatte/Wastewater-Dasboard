import { bpSpanPx, Region, SimpleFeature } from '@jbrowse/core/util'

import {
  Feature,
  SimpleFeatureSerialized,
} from '@jbrowse/core/util/simpleFeature'


import { BaseLayout} from '@jbrowse/core/util/layouts'
// locals
import { Mismatch } from '../MismatchParser'
// import SimpleFeature, { SimpleFeatureArgs } from '@jbrowse/core/util/simpleFeature';


export interface LayoutRecord {
  feature: Feature
  leftPx: number
  rightPx: number
  topPx: number
  heightPx: number
}


// export interface UnseenPair {
//   unseenKey: any;  // Replace 'any' with a more specific type if possible
//   mutation: any;      // Replace 'any' with a more specific type if possible
// }

export function layoutFeature({
  feature,
  layout,
  bpPerPx,
  region,
  showSoftClip,
  heightPx,
  displayMode,
}: {
  feature: Feature
  layout: BaseLayout<Feature>
  bpPerPx: number
  region: Region
  showSoftClip?: boolean
  heightPx: number
  displayMode: string
}): LayoutRecord | null {


  let expansionBefore = 0
  let expansionAfter = 0

  // showSoftClip = true;

  // Expand the start and end of feature when softclipping enabled
  if (showSoftClip) {
    const mismatches = feature.get('mismatches') as Mismatch[]
    const seq = feature.get('seq') as string
    if (seq) {
      for (const { type, start, cliplen = 0 } of mismatches) {
        if (type === 'softclip') {
          start === 0 ? (expansionBefore = cliplen) : (expansionAfter = cliplen)
        }
      }
    }
  } 

  const [leftPx, rightPx] = bpSpanPx(
    feature.get('start') - expansionBefore,
    feature.get('end') + expansionAfter,
    region,
    bpPerPx,
  )

  if (displayMode === 'compact') {
    heightPx /= 3
  }
  
  if (feature.get('refName') !== region.refName) {
    throw new Error(
      `feature ${feature.id()} is not on the current region's reference sequence ${
        region.refName
      }`,
    )
  }

  const topPx = layout.addRect(
    feature.id(),
    feature.get('start') - expansionBefore,
    feature.get('end') + expansionAfter,
    heightPx,
    feature,
  )
  if (topPx === null) {
    return null
  }

  return {
    feature,
    leftPx,
    rightPx,
    topPx: displayMode === 'collapse' ? 0 : topPx,
    heightPx,
  }
}