import React from 'react'
import { BaseCard } from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'
import { SimpleFeatureSerialized, getEnv, getSession } from '@jbrowse/core/util'
import { ViewType } from '@jbrowse/core/pluggableElementTypes'

// locals
import { AlignmentFeatureWidgetModel } from './stateModelFactory'
import SuppAlignmentsLocStrings from './SuppAlignmentsLocStrings'
import LaunchBreakpointSplitViewPanel from './LaunchBreakpointSplitViewPanel'


export default function UnaccountedMutations(props) {

    // const umArray: string[] = UM.split(",");

  const {UM_ID, unseen_mutations, is_sequence} = props

  const um_ids = UM_ID ? UM_ID.split(",") : [];


  type UnaccountedItem = { unseenKey: string; mutation: string };
  console.log("um_ids", um_ids)
  const mapping = Object.fromEntries(
    (Object.values(unseen_mutations).flat() as UnaccountedItem[]).map(
      item => [item.unseenKey, item.mutation.split(":")]
    )
  );

  return (
    <BaseCard title={is_sequence? "Possible Unaccounted Mutations": "Unaccounted Mutations"}>
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      
    {um_ids && um_ids.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th style={{ padding: '5px 10px 5px 10px', textAlign: 'center', fontWeight: 'bold' }}>Mutation</th>
            <th style={{ padding: '5px 10px 5px 10px', textAlign: 'center', fontWeight: 'bold' }}>Residue</th>
            <th style={{ padding: '5px 10px 5px 10px', textAlign: 'center', fontWeight: 'bold' }}>Allele Frequency</th>
            <th style={{ padding: '5px 10px 5px 10px', textAlign: 'center', fontWeight: 'bold' }}>Depth</th>
          </tr>
        </thead>
        <tbody>
                {um_ids.map(item => {
          const value = mapping[item]
          return (
            <tr key={item} style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>
                {(value as string[])[0]}
              </td>
              <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>
                {(value as string[])[1]}
              </td>
            </tr>
          )
        })}
        </tbody>
      </table>
    ) : (
    <div>
        No unaccounted mutations available
    </div>
    )
  }
    </div>
    </BaseCard>
  )
}