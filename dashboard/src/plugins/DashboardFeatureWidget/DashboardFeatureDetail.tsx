import React from 'react'
import { Paper } from '@mui/material'
import { observer } from 'mobx-react'
import clone from 'clone'
import { FeatureDetails } from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'

// locals
import { getTag } from './util'
import { tags } from './taginfo'
import { AlignmentFeatureWidgetModel } from './stateModelFactory'

// local components
import SuppAlignments from './SuppAlignments'
import UnnaccountedMutations from './UnaccountedMutationsTable'
import Flags from './Flags'
import PairLink from './PairLink'
import Formatter from './Formatter'
import {
    SimpleFeature,
  } from '@jbrowse/core/util'

const omit = ['clipPos', 'flags', "UM"]

const AlignmentsFeatureDetails = observer(function (props: {
  model: AlignmentFeatureWidgetModel
}) {
  const { model } = props
  const feat = clone(model.featureData)

  const display_id = model.display_id

  if (display_id.includes("sequence")) {
    omit.push('qual', 'template_length', 'Score', 'MQ', 'CIGAR', 'length_on_ref', 'seq_length')
  }



  const SA = getTag('SA', feat) as string

  const UM = getTag('UM', feat) as string


  
  return (
    <Paper data-testid="alignment-side-drawer">
      <FeatureDetails
        {...props}
        omit={omit}
        // @ts-expect-error
        descriptions={{ ...tags, tags: tags }}
        feature={feat}
        formatter={(value, key) =>
          key === 'next_segment_position' ? (
            <PairLink model={model} locString={value as string} />
          ) : (
            <Formatter value={value} />
          )
        }
      />
      
      <UnnaccountedMutations UM={UM} />

      {SA ? <SuppAlignments model={model} tag={SA} feature={feat} /> : null}
      {feat.flags !== undefined ? <Flags feature={feat} {...props} /> : null}
    </Paper>
  )
})

export default AlignmentsFeatureDetails