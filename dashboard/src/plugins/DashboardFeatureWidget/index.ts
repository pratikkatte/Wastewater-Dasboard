import { lazy } from 'react'

import WidgetType from '@jbrowse/core/pluggableElementTypes/WidgetType'

import { ConfigurationSchema } from '@jbrowse/core/configuration'
import PluginManager from '@jbrowse/core/PluginManager'

// import { configSchema } from './configSchema'
import { stateModelFactory } from './stateModelFactory'



export default function register(pluginManager: PluginManager) {
    const configSchema = ConfigurationSchema('DashboardFeatureWidget', {})

    pluginManager.addWidgetType(
        () =>
          new WidgetType({
            name: 'DashboardFeatureWidget',
            heading: 'Feature details',
            configSchema:configSchema,
            stateModel: stateModelFactory(pluginManager),
            ReactComponent: lazy(() => import('./DashboardFeatureDetail')),
          }),
        )}

