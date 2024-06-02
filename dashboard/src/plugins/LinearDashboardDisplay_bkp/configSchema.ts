import PluginManager from '@jbrowse/core/PluginManager'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import LinearGenomeViewPlugin from '@jbrowse/plugin-linear-genome-view'
import {types} from 'mobx-state-tree'

export default (pluginManager: PluginManager) => {

    const { baseLinearDisplayConfigSchema } = (
    pluginManager.getPlugin('LinearGenomeViewPlugin') as LinearGenomeViewPlugin
  ).exports
  return ConfigurationSchema(
    'LinearDashboardDisplay',
    {
      defaultRendering: {
        type: 'stringEnum',
        model: types.enumeration('Rendering', ['pileup']),
        defaultValue: 'pileup',
    },
    renderers: ConfigurationSchema('RenderersConfiguration', {
      PileupRenderer:
      pluginManager.getRendererType('PileupRenderer').configSchema,
    }),

    colorScheme: {
      type: 'stringEnum',
      model: types.enumeration('colorScheme', [
        'strand',
        'normal',
        'insertSize',
        'insertSizeAndOrientation',
        'mappingQuality',
        'tag',
      ]),
      description: 'color scheme to use',
      defaultValue: 'mappingQuality',
    },
    groupname_tag: {
      type: 'string',
      defaultValue: "",
    }
  },
    { baseConfiguration: baseLinearDisplayConfigSchema, explicitlyTyped: true },
  )
}