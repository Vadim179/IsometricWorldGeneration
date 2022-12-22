import { generatePerlinNoise } from "perlin-noise"
import { getContext } from "./Canvas"
import { TerrainConfig } from "./Config/Terrain.Config"
import { AssetMap } from "./AssetLoader"

/**
 * @typedef {Object} Tile
 * @property {number} x
 * @property {number} y
 * @property {HTMLImageElement} image
 */

/**
 * @param {Map<string, HTMLImageElement>} context
 * @param {Map<string, HTMLImageElement>} assetMap
 * @returns
 */
export function generateTerrain() {
  const { mapSize, tileSize } = TerrainConfig
  const terrain = []

  const offsetX = 0
  const offsetZ = (mapSize * tileSize) / 3

  const noise = generatePerlinNoise(mapSize, mapSize)
  let noiseAmplitudeIndex = 0

  for (let z = 0; z < mapSize; z++) {
    terrain[z] = []

    for (let x = 0; x < mapSize; x++) {
      const noiseAmplitude = noise[noiseAmplitudeIndex]

      const tileImage = getTileImageByNoiseAmplitude(noiseAmplitude)
      const tileAmplitude = getTileAmplitudeByNoiseAmplitude(noiseAmplitude)

      const xPosition = (tileSize / 2) * (x - z) - offsetX
      const zPosition =
        (x + z) * (tileSize / 3) - offsetZ - tileAmplitude * (tileSize / 3)

      terrain[z][x] = {
        image: tileImage,
        x: xPosition,
        z: zPosition,
      }

      noiseAmplitudeIndex++
    }
  }

  return terrain
}

/**
 * @param {number} noiseAmplitude
 * @returns {HTMLImageElement}
 */
function getTileImageByNoiseAmplitude(noiseAmplitude) {
  let imageName

  if (noiseAmplitude < 0.3) imageName = "WaterTile.svg"
  else if (noiseAmplitude < 0.5) imageName = "SandTile.svg"
  else if (noiseAmplitude < 0.7) imageName = "GrassTile.svg"
  else imageName = "HillGrassTile.svg"

  return AssetMap.get(imageName)
}

/**
 * @param {number} noiseAmplitude
 * @returns {number}
 */
function getTileAmplitudeByNoiseAmplitude(noiseAmplitude) {
  let amplitude

  if (noiseAmplitude < 0.3) amplitude = -0.25
  else if (noiseAmplitude < 0.5) amplitude = 0
  else if (noiseAmplitude < 0.7) amplitude = 1
  else amplitude = 2

  return amplitude
}

/**
 * @param {Array<Array<Tile>>} terrain
 */
export function drawTerrain(terrain) {
  const { tileSize } = TerrainConfig
  const context = getContext()

  for (const row of terrain) {
    for (const tile of row) {
      const { image, x, z } = tile
      context.drawImage(image, x, z, tileSize, tileSize)
    }
  }
}

/**
 * @param {Array<Array<Tile>>} terrain
 */
export function drawTileCoordinates(terrain) {
  const { tileSize } = TerrainConfig
  const context = getContext()

  for (const [rowIndex, row] of terrain.entries()) {
    for (const [tileIndex, tile] of row.entries()) {
      const { x, z } = tile

      context.textAlign = "center"
      context.textBaseline = "middle"
      context.fillText(
        `${tileIndex}, ${rowIndex}`,
        x + tileSize / 2,
        z + tileSize / 3,
      )
    }
  }
}
