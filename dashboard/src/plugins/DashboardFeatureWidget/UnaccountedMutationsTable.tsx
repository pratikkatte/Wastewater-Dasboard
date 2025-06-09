import React from 'react'
import { jsx } from 'react/jsx-runtime'
import { BaseCard } from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

type UnaccountedItem = {
  unseenKey: string
  mutation: string
}

interface UnaccountedMutationsProps {
  UM_ID?: string
  unseen_mutations?: { [key: string]: UnaccountedItem[] } | null
  is_sequence?: boolean
}

export default function UnaccountedMutations(props: UnaccountedMutationsProps) {
  const { UM_ID, unseen_mutations, is_sequence } = props || {}

  // Defensive: handle UM_ID
  const um_ids: string[] =
    typeof UM_ID === 'string' && UM_ID.length > 0
      ? UM_ID.split(',').map((id) => id.trim()).filter(Boolean)
      : []

  // Defensive: unseen_mutations might not be an object or may have bad values
  let mapping: Record<string, string[]> = {}
  try {
    mapping = Object.fromEntries(
      (Array.isArray(Object.values(unseen_mutations || {}))
        ? Object.values(unseen_mutations || {}).flat()
        : []
      )
        .filter(
          (item: any): item is UnaccountedItem =>
            item &&
            typeof item.unseenKey === 'string' &&
            typeof item.mutation === 'string'
        )
        .map((item) => [item.unseenKey, item.mutation.split(':')])
    )
  } catch (err) {
    mapping = {}
  }

  // Helper to safely access array index and number conversion
  function safeNum(arr: string[] | undefined, idx: number): string {
    const val =
      arr && arr.length > idx && arr[idx] !== undefined
        ? Number(arr[idx])
        : ''
    return typeof val === 'number' && !isNaN(val) && val !== ''
      ? val.toFixed(3)
      : ''
  }

  return (
    <BaseCard
      title={is_sequence ? 'Possible Unaccounted Alleles' : 'Unaccounted Alleles'}
    >
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {um_ids.length > 0 || (is_sequence && Object.keys(mapping).length > 0) ? (
          <table>
            <thead>
              <tr>
                <th style={{ padding: '5px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                  Allele
                </th>
                <th style={{ padding: '5px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                  Residue
                </th>
                <th style={{ padding: '5px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                  Allele Frequency
                </th>
                <th style={{ padding: '5px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                  Depth
                </th>
              </tr>
            </thead>
            <tbody>
              {is_sequence ? (
                Object.entries(mapping).map(([key, value]) => (
                  <tr key={key} style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>
                      {(value && value[0]) || ''}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>
                      {safeNum(value, 1)}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>
                      {safeNum(value, 2)}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>
                      {(value && value[3]) || ''}
                    </td>
                  </tr>
                ))
              ) : (
                um_ids.map((item) => {
                  const value = mapping[item]
                  if (!value) return null;
                  return (
                    <tr key={item} style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>
                        {(value && value[0]) || ''}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>
                        {safeNum(value, 1)}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>
                        {safeNum(value, 2)}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>
                        {(value && value[3]) || ''}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        ) : (
          <div>No unaccounted alleles</div>
        )}
      </div>
    </BaseCard>
  )
}
