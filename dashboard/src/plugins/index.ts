import PluginManager from '@jbrowse/core/PluginManager'
import Plugin from '@jbrowse/core/Plugin'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { DisplayType, TrackType, createBaseTrackConfig, createBaseTrackModel  } from '@jbrowse/core/pluggableElementTypes'

import LinearDashboardDisplayF from './LinearDashboardDisplay'
import DashboardTrackModel from './DashboardTrack/model'

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

  // pluginManager.addTrackType(() => {
  //   const configSchema = ConfigurationSchema(
  //         'DashboardTrack',
  //         {}, 
  //         {
  //           baseConfiguration: createBaseTrackConfig(pluginManager),
  //           explicitIdentifier: 'trackId',
  //         }
  //       )
      
  //   const track = new TrackType({
  //     name: 'DashboardTrack', 
  //     configSchema,
  //     stateModel: DashboardTrackModel(pluginManager, configSchema)
  //   })

  //   const linearPileupDisplay = pluginManager.getDisplayType('LinearPileupDisplay')

  //   const linearDashboardDisplay = pluginManager.getDisplayType('LinearDashboardDisplay')

  //   track.addDisplayType(linearPileupDisplay)
  //   track.addDisplayType(linearDashboardDisplay)

  //   return track
  // })


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

  }
}


// import Plugin from "@jbrowse/core/Plugin";
// import PluginManager from "@jbrowse/core/PluginManager";
// import DisplayType from "@jbrowse/core/pluggableElementTypes/DisplayType";
// import rendererFactory, {
//   configSchema as rendererConfigSchema,
// } from "./LinearManhattanRenderer";
// import {
//   configSchemaFactory as displayConfigSchemaFactory,
//   stateModelFactory as displayModelFactory,
// } from "./LinearManhattanDisplay";

// export default class AlignmentsPlugin extends Plugin {
//   name = "GWASPlugin";

//   install(pluginManager: PluginManager) {
//     const WigglePlugin = pluginManager.getPlugin(
//       "WigglePlugin",
//     ) as import("@jbrowse/plugin-wiggle").default;

//     const {
//       LinearWiggleDisplayReactComponent,
//       XYPlotRendererReactComponent,
//       //@ts-ignore
//     } = WigglePlugin.exports;

//     pluginManager.addDisplayType(() => {
//       const configSchema = displayConfigSchemaFactory(pluginManager);
//       return new DisplayType({
//         name: "LinearManhattanDisplay",
//         configSchema,
//         stateModel: displayModelFactory(pluginManager, configSchema),
//         trackType: "FeatureTrack",
//         viewType: "LinearGenomeView",
//         ReactComponent: LinearWiggleDisplayReactComponent,
//       });
//     });

//     pluginManager.addRendererType(() => {
//       //@ts-ignore
//       const ManhattanRenderer = new rendererFactory(pluginManager);
//       const configSchema = rendererConfigSchema;
//       return new ManhattanRenderer({
//         name: "LinearManhattanRenderer",
//         ReactComponent: XYPlotRendererReactComponent,
//         configSchema,
//         pluginManager,
//       });
//     });
//   }

//   configure(pluginManager: PluginManager): {} {
//     return {};
// }
// }