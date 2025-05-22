import PluginManager from "@jbrowse/core/PluginManager";
import { DisplayType, TrackType, createBaseTrackConfig, createBaseTrackModel, RendererType } from '@jbrowse/core/pluggableElementTypes'
import { ConfigurationSchema } from '@jbrowse/core/configuration'


export default function register(pluginManager: PluginManager) {
    
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
        const linearAlignmentDisplay = pluginManager.getDisplayType('LinearAlignmentsDisplay')
        const linearDashboardDisplay = pluginManager.getDisplayType('LinearDashboardDisplay')
    
        track.addDisplayType(linearPileupDisplay)
        track.addDisplayType(linearDashboardDisplay)
        track.addDisplayType(linearAlignmentDisplay)
        return track
      })
}


