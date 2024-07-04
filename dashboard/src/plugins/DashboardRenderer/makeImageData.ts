import { Feature } from '@jbrowse/core/util'
import { RenderArgsDeserializedWithFeaturesAndLayout } from './DashboardRenderer'
import { readConfObject } from '@jbrowse/core/configuration'
import { createJBrowseTheme } from '@jbrowse/core/ui'
import {
  getCharWidthHeight,
  getColorBaseMap,
  getContrastBaseMap,
  shouldDrawIndels,
  shouldDrawSNPsMuted,
} from './util'
import { renderAlignment } from './renderAlignment'

export type RenderArgsWithColor = RenderArgsDeserializedWithFeaturesAndLayout

interface LayoutFeature {
  heightPx: number
  topPx: number
  feature: Feature
}

export function makeImageData({
  ctx,
  layoutRecords,
  canvasWidth,
  renderArgs,
}: {
  ctx: CanvasRenderingContext2D
  canvasWidth: number
  layoutRecords: LayoutFeature[]
  renderArgs: RenderArgsWithColor
}) {
  const { config, showSoftClip, colorBy, theme: configTheme } = renderArgs
  const mismatchAlpha = readConfObject(config, 'mismatchAlpha')
  const minSubfeatureWidth = readConfObject(config, 'minSubfeatureWidth')
  const largeInsertionIndicatorScale = readConfObject(
    config,
    'largeInsertionIndicatorScale',
  )
  const defaultColor = readConfObject(config, 'color') === '#f0f'
  const theme = createJBrowseTheme(configTheme)
  const colorForBase = getColorBaseMap(theme)
  const contrastForBase = getContrastBaseMap(theme)
  ctx.font = 'bold 10px Courier New,monospace'

  const { charWidth, charHeight } = getCharWidthHeight()
  const drawSNPsMuted = shouldDrawSNPsMuted(colorBy?.type)
  const drawIndels = shouldDrawIndels()
  for (const feat of layoutRecords) {
    renderAlignment({
      ctx,
      feat,
      renderArgs,
      defaultColor,
      colorForBase,
      contrastForBase,
      charWidth,
      charHeight,
      canvasWidth,
    })
  }
}