import { lazy } from 'react'
import PluginManager from '@jbrowse/core/PluginManager'
import Plugin from '@jbrowse/core/Plugin'

import LinearDashboardDisplayF from './LinearDashboardDisplay'
import DashboardTrackF from './DashboardTrack'
import DashboardAdapterF from './DashboardAdapter'

import WidgetType from '@jbrowse/core/pluggableElementTypes/WidgetType'


import DashboardFeatureWidgetF from './DashboardFeatureWidget'

export default class DashboardPlugin extends Plugin {
  name = 'DashboardPlugin'

  install(pluginManager: PluginManager) {

    ;[LinearDashboardDisplayF,
      DashboardTrackF,
      DashboardAdapterF,
      DashboardFeatureWidgetF
    ].map(f => {
      f(pluginManager)
    })

  // pluginManager.addRendererType(() => {
  //   return new DashboardRender({
  //     name: 'DashboardRenderer', 
  //     displayName: 'Dashboard renderer',
  //     ReactComponent: DashboardRenderingComponent, 
  //     configSchema: DashboardRenderingSchema, 
  //     pluginManager
  //   })
  // })
  }
}