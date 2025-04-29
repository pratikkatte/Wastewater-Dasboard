import React from 'react'
import { BaseCard } from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'

export default function UncertainNodes(props) {

    const {uncertain_nodes_names } = props

    return (
        <BaseCard title="Uncertain Nodes">
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    {uncertain_nodes_names && uncertain_nodes_names.length>0 ? (uncertain_nodes_names.map((node, index) => (
                        <li key={index} style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd', padding: '8px' }}>
                            <span style={{ fontWeight: 'bold' }}>{node}</span>
                        </li>
                    ))) : (
                    <span style={{ fontWeight: 'bold' }}>No Uncertain Nodes</span>
                    )}
                </ul>
            </div>
        </BaseCard>
    )
}