import { getCanvas, renderCanvas, clearCanvas, getContext } from "./Canvas"

import { Assets } from "./Config/Assets.Config"
import { TerrainConfig } from "./Config/Terrain.Config"

import { loadAssets } from "./AssetLoader"
import { generateTerrain, drawTerrain } from "./TerrainGenerator"

const canvas = getCanvas()
canvas.width = window.innerWidth
canvas.height = window.innerHeight

loadAssets(Assets).then(() => {
  const { tileSize } = TerrainConfig

  const context = getContext()
  let terrain = generateTerrain()

  let scale = 1
  window.addEventListener("wheel", (event) => {
    scale = Math.min(Math.max(0.5, scale + event.deltaY * -(1 / 1000)), 1.5)
  })

  renderCanvas(() => {
    clearCanvas()

    context.save()
    context.translate((innerWidth - tileSize * scale) / 2, innerHeight / 2)
    context.scale(scale, scale)

    drawTerrain(terrain)
    context.restore()
  })
})
