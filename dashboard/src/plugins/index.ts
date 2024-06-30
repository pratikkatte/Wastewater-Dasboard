import PluginManager from '@jbrowse/core/PluginManager'
import Plugin from '@jbrowse/core/Plugin'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { DisplayType, TrackType, createBaseTrackConfig, createBaseTrackModel  } from '@jbrowse/core/pluggableElementTypes'

import LinearDashboardDisplayF from './LinearDashboardDisplay'
import AdapterType from '@jbrowse/core/pluggableElementTypes/AdapterType'
import { AdapterClass, configSchema } from './DashboardAdapter'


export default class DashboardPlugin extends Plugin {
  name = 'DashboardPlugin'

  install(pluginManager: PluginManager) {
    const LGVPlugin = pluginManager.getPlugin(
      'LinearGenomeViewPlugin', 
    ) as import('@jbrowse/plugin-linear-genome-view').default

  const { BaseLinearDisplayComponent } = LGVPlugin.exports

  pluginManager.addTrackType(() => {
    const configSchema = ConfigurationSchema(
      'DashboardTrack',
      {}, 
      {
        baseConfiguration: createBaseTrackConfig(pluginManager),
        explicitIdentifier: 'trackId',
      }
    )
    const track = new TrackType({
      name: 'DashboardTrack',
      configSchema,
      stateModel: createBaseTrackModel(
        pluginManager, 
        'DashboardTrack',
        configSchema,
      ),
    })
    const linearPileupDisplay = pluginManager.getDisplayType('LinearPileupDisplay')

    const linearDashboardDisplay = pluginManager.getDisplayType('LinearDashboardDisplay')
    track.addDisplayType(linearPileupDisplay)
    track.addDisplayType(linearDashboardDisplay)
    return track
  }) 


  pluginManager.addDisplayType(() => {
    const { configSchema, stateModel } = LinearDashboardDisplayF(pluginManager)
    return new DisplayType({
      name: 'LinearDashboardDisplay',
      configSchema,
      stateModel,
      trackType: 'DashboardTrack',
      viewType: 'LinearGenomeView',
      ReactComponent: BaseLinearDisplayComponent
    })
  })

  pluginManager.addAdapterType(
    () =>
      new AdapterType({
        name: 'DashboardAdapter',
        AdapterClass,
        configSchema,
      }),
  )
  }
}