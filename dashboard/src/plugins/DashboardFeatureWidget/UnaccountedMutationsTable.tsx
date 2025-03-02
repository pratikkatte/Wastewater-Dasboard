import React from 'react'
import { BaseCard } from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'
import { SimpleFeatureSerialized, getEnv, getSession } from '@jbrowse/core/util'
import { ViewType } from '@jbrowse/core/pluggableElementTypes'

// locals
import { AlignmentFeatureWidgetModel } from './stateModelFactory'
import SuppAlignmentsLocStrings from './SuppAlignmentsLocStrings'
import LaunchBreakpointSplitViewPanel from './LaunchBreakpointSplitViewPanel'


export default function UnaccountedMutations(UM) {

    // const umArray: string[] = UM.split(",");


//   const { model, tag, feature } = props
//   const session = getSession(model)
//   const { pluginManager } = getEnv(session)
//   let viewType: ViewType | undefined

//   try {
//     viewType = pluginManager.getViewType('BreakpointSplitView')
//   } catch (e) {
//     // ignore
//   }

  return (
    <BaseCard title="Unnaccounted Mutations">
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th style={{ padding: '5px 10px 5px 10px', textAlign: 'center', fontWeight: 'bold' }}>ID</th>
            <th style={{ padding: '5px 10px 5px 10px', textAlign: 'center', fontWeight: 'bold' }}>Mutation</th>
            <th style={{ padding: '5px 10px 5px 10px', textAlign: 'center', fontWeight: 'bold' }}>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {UM && Object.keys(UM).length > 0 ? (
            Object.entries(UM['UM']).map(([key, value]) => (
              
              <tr key={key} style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{key}</td>
                <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>{(value as string[])[0]}</td>
                <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>{(value as string[])[1]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                No unaccounted mutations available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </BaseCard>
  )
}