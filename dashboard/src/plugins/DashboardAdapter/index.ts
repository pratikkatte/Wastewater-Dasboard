
import AdapterClass from './DashboardAdapter'
import PluginManager from "@jbrowse/core/PluginManager";
import AdapterType from '@jbrowse/core/pluggableElementTypes/AdapterType'

import configSchema  from './configSchema'

export default function register(pluginManager: PluginManager) {
    pluginManager.addAdapterType(
        () =>
          new AdapterType({
            name: 'DashboardAdapter',
            AdapterClass,
            configSchema: configSchema,
          }),
      )
}