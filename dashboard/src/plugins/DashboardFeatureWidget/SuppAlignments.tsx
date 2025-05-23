import React from 'react'
import { BaseCard } from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'
import { SimpleFeatureSerialized, getEnv, getSession } from '@jbrowse/core/util'
import { ViewType } from '@jbrowse/core/pluggableElementTypes'

// locals
import { AlignmentFeatureWidgetModel } from './stateModelFactory'
import SuppAlignmentsLocStrings from './SuppAlignmentsLocStrings'
import LaunchBreakpointSplitViewPanel from './LaunchBreakpointSplitViewPanel'


export default function SuppAlignments(props: {
  tag: string
  model: AlignmentFeatureWidgetModel
  feature: SimpleFeatureSerialized
}) {
  const { model, tag, feature } = props
  const session = getSession(model)
  const { pluginManager } = getEnv(session)
  let viewType: ViewType | undefined

  try {
    viewType = pluginManager.getViewType('BreakpointSplitView')
  } catch (e) {
    // ignore
  }

  return (
    <BaseCard {...props} title="Supplementary alignments">
      <SuppAlignmentsLocStrings model={model} tag={tag} />
      {viewType ? (
        <LaunchBreakpointSplitViewPanel
          viewType={viewType}
          model={model}
          feature={feature}
        />
      ) : null}
    </BaseCard>
  )
}