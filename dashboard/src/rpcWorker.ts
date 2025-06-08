import './workerPolyfill'
import { initializeWorker } from '@jbrowse/product-core'
import { enableStaticRendering } from 'mobx-react'

// locals
import corePlugins from '@jbrowse/react-linear-genome-view/esm/corePlugins'
import DashboardPlugin from './plugins'
import { Buffer } from 'buffer'

self.Buffer = Buffer

// static rendering is used for "SSR" style rendering which is done on the
// worker
enableStaticRendering(true)

initializeWorker([...corePlugins, DashboardPlugin], {})

export default function doNothing() {
  /* do nothing */
}

