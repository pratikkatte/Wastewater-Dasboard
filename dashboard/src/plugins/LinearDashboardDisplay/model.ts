import { types } from 'mobx-state-tree'
import type { PluginManager } from '@jbrowse/core'
import {
  linearPileupDisplayStateModelFactory,
} from '@jbrowse/plugin-alignments'
import {
  AnyConfigurationSchemaType,
  ConfigurationReference,
  getConf
} from '@jbrowse/core/configuration'
import {IFilter} from './FilterByTag'
import SortIcon from '@mui/icons-material/Sort'
import VisibilityIcon from '@mui/icons-material/Visibility'


import {
  getSession,
  getContainingTrack,
  isSessionModelWithWidgets,
  Feature,
  getContainingView,
  getEnv,
  SimpleFeature,
} from '@jbrowse/core/util'


const unseenModel = types.model({
  show: types.boolean,
  mutation: types.string
})

const FilterModel = types.model({
  flagInclude: types.optional(types.number, 0),
  flagExclude: types.optional(types.number, 1540),
  readName: types.maybe(types.string),
  tagFilter: types.maybe(
    types.model({
      tag: types.string,
      value: types.string,
    }),
  ),
  filterReads: types.optional(types.frozen(), {})
})

export default (pluginManager: PluginManager, configSchema) => {
  // retrieve the base state model from the alignments plugin

  const BaseModel = linearPileupDisplayStateModelFactory(configSchema)

  // compose with the shared mixin and add our own flag + action
  return types
    .compose(
      'LinearDashboardDisplay',
      // SharedLinearPileupDisplayMixin,
      BaseModel,
      types.model({
        type: types.literal('LinearDashboardDisplay'),
        /** whether to show the custom options button */
        unseenKeys: types.optional(types.map(unseenModel), {}),
        showEPColor: false,
        // filterBy: types.optional(FilterModel, {}),
      }),
    )
    .volatile(() => ({
      group_id:'' as string,
    }))
    .actions(self => ({

      toggleEPDisplay() {
        self.showEPColor = !self.showEPColor

        if(self.showEPColor)
        {
          self.setColorScheme({type: 'tag', tag: 'EP'})
        }
        else {
          self.setColorScheme({type: 'mappingQuality'});
        }
      },

      selectFeature(feature: Feature) {

        const session = getSession(self)
        if (isSessionModelWithWidgets(session)) {
          const featureWidget = session.addWidget(
            'DashboardFeatureWidget',
            'alignmentFeature',
            { featureData: feature.toJSON(), view: getContainingView(self),
              track: getContainingTrack(self), 
              "display_id": self.configuration.toJSON().displayId,
              'all_group_name': getConf(self, 'all_group_name'),
              "uncertain_nodes_names": getConf(self, 'uncertain_nodes'),
              "unseen_mutations":  getConf(self, 'groupname_tag'),
              // "unseen_mutations": self.unseenKeys
             },
          )
          session.showWidget(featureWidget)
        }
        session.setSelection(feature)
      },

      toggleUnaccountedMutationsDisplay(um_group: string) {

        const item = self.unseenKeys.get(um_group);

        if(item){
          item.show = !item.show;
        }

        const filter_reads_by_tag = {}

        filter_reads_by_tag[self.group_id] = []

        self.unseenKeys.forEach((value, key) => {
          if(value.show) {
            filter_reads_by_tag[self.group_id].push({'unseenKey':key, 'mutation': value.mutation})
          }
        });

        let um_filter_reads: IFilter = {
          flagExclude: 1540, 
          flagInclude: 0,
          tagFilter: {tag:'RG','value': self.group_id},
          filterReads: filter_reads_by_tag
        }

        self.setFilterBy(um_filter_reads)
    },

      afterAttach() {

        const is_sequence = self.configuration.toJSON().displayId.includes("sequence") ? true : false
        
        const group_name = getConf(self, 'groupname_tag')


        self.setColorScheme({type: 'mappingQuality'});

        const group_name_keys = Object.keys(group_name);

          self.group_id = group_name_keys[0]


            group_name[self.group_id].map(item => {
              self.unseenKeys.set(item.unseenKey, unseenModel.create({ show: false, mutation: item.mutation}))
            })

            const filter_reads_tags = {}
            if(is_sequence){
              filter_reads_tags[self.group_id] = []
            }
            else {
              filter_reads_tags[self.group_id] = []
            }

            self.setColorScheme({type: 'mappingQuality'});
            
            let filter_reads: IFilter = {
              flagExclude: 1540,
              flagInclude: 0,
              tagFilter: {tag:'RG','value': self.group_id},
              filterReads: filter_reads_tags
            }
            self.setFilterBy(filter_reads)

      }
      

    }))
    .views(self => {
      const {
        trackMenuItems: superTrackMenuItems,
      } = self



      
      return {
      trackMenuItems() {
        return [
          
          {
            label: 'color by EPP',
            icon: VisibilityIcon,
            type: 'checkbox',
            checked: self.showEPColor,
            onClick: () => {
              self.toggleEPDisplay()
            }
          },
          {
            label: "unaccounted alleles",
            icon: SortIcon,
            subMenu: Array.from(self.unseenKeys.entries()).map(([key, item]) => ({
              label: item.mutation.split(":")[0],
              type:'checkbox',
              checked: item.show,
              onClick: () => {
                self.toggleUnaccountedMutationsDisplay(key)
              }
            }))
          },
          ...superTrackMenuItems()
        ]
    }
  }
})
   
}