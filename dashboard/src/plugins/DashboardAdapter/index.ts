
import PluginManager from "@jbrowse/core/PluginManager";
import AdapterType from '@jbrowse/core/pluggableElementTypes/AdapterType'

import configSchema  from './configSchema'

export default function register(pluginManager: PluginManager) {
    pluginManager.addAdapterType(
        () =>
          new AdapterType({
            name: 'DashboardAdapter',
            // AdapterClass,
            getAdapterClass: () => import('./DashboardAdapter').then(r => r.default),
            configSchema: configSchema,
          }),
      )
}