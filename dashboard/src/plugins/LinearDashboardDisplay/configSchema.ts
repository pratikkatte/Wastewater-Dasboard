import { ConfigurationSchema } from '@jbrowse/core/configuration'
import type { PluginManager } from '@jbrowse/core'
import {
  linearPileupDisplayConfigSchemaFactory,
} from '@jbrowse/plugin-alignments'
import {types} from 'mobx-state-tree'


const Unseen = types.model({
  unseenKey: types.string,    // e.g., "unseen1" or "unseen2"
  value: types.string         // e.g., "AT10:10%" or "GC10:20%"
});

const Group = types.array(Unseen);

const RootModel = types.model({
  groupname_tag: types.map(types.array(Unseen))    
});

export default (pluginManager: PluginManager) => {
  // base config from alignments plugin
  const baseConfig = linearPileupDisplayConfigSchemaFactory(pluginManager)

  return ConfigurationSchema(
    'LinearDashboardDisplay',
    {
      /** toggle the custom options button */
      showOptions: {
        type: 'boolean',
        defaultValue: true,
        description: 'Show the extra options button in pileup tracks',
      },
      all_group_name: {
        type: 'frozen',
        defaultValue: {}
      },
      uncertain_nodes: {
        type: 'frozen',
        defaultValue: {}
      },
      groupname_tag: {
        // type: 'string',
        // defaultValue: "",
        type: 'frozen',
        mode: RootModel,
        description: "read groups",
        defaultValue: {},
    },
  },
    { baseConfiguration: baseConfig },
  )
}