import PluginManager from "@jbrowse/core/PluginManager";
import configSchemaF from "./configSchema";
import modelF from './model'
import { BaseLinearDisplayComponent } from '@jbrowse/plugin-linear-genome-view'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'

export default function register(pluginManager: PluginManager) {
    pluginManager.addDisplayType(() => {
      const configSchema = configSchemaF(pluginManager)
      return new DisplayType({
        name: 'LinearDashboardDisplay',
        configSchema,
        stateModel: modelF(pluginManager, configSchema),
        trackType: 'DashboardTrack',
        viewType: 'LinearGenomeView',
        ReactComponent: BaseLinearDisplayComponent
      })
    })
  }

