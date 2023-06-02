import { generatePerlinNoise } from "perlin-noise";
import { getContext } from "./Canvas";
import { TerrainConfig } from "./__Config/Terrain.Config";
import { AssetMap } from "./AssetLoader";

export function generateTerrain(mapSize = 32) {
  const { tileSize } = TerrainConfig;
  const terrain = [];

  const offsetX = 0;
  const offsetZ = (mapSize * tileSize) / 3;

  const noise = generatePerlinNoise(mapSize, mapSize);
  let noiseAmplitudeIndex = 0;

  for (let z = 0; z < mapSize; z++) {
    terrain[z] = [];

    for (let x = 0; x < mapSize; x++) {
      const noiseAmplitude = noise[noiseAmplitudeIndex];

      const tileAmplitude = Math.ceil(noiseAmplitude * 8);
      const tileImage = getTileImageByTileAmplitude(tileAmplitude);

      const xPosition = (tileSize / 2) * (x - z) - offsetX;
      const zPosition =
        (x + z) * (tileSize / 3) -
        offsetZ -
        (tileAmplitude <= 2 ? 2.5 : tileAmplitude) * (tileSize / 3);

      terrain[z][x] = {
        image: tileImage,
        x: xPosition,
        z: zPosition,
        y: tileAmplitude
      };

      noiseAmplitudeIndex++;
    }
  }

  return terrain;
}
function getTileImageByTileAmplitude(tileAmplitude) {
  let imageName;

  if (tileAmplitude <= 2) imageName = "WaterTile.svg";
  else imageName = "GrassTile.svg";

  return AssetMap.get(imageName);
}

export function drawTerrain(terrain) {
  const { tileSize } = TerrainConfig;
  const context = getContext();

  const offScreenCanvas = document.createElement("canvas");
  const offScreenContext = offScreenCanvas.getContext("2d");

  offScreenCanvas.width = tileSize;
  offScreenCanvas.height = tileSize;

  for (const row of terrain) {
    for (const tile of row) {
      const { image, x, z, y } = tile;
      offScreenContext.clearRect(0, 0, tileSize, tileSize);

      if (y <= 2) {
        context.drawImage(image, x, z, tileSize, tileSize);
        continue;
      }

      offScreenContext.drawImage(image, 0, 0, tileSize, tileSize);

      const yColorModifier = y / 8;
      const r = yColorModifier * 100;
      const g = yColorModifier * 150;
      const b = yColorModifier * 100;

      offScreenContext.fillStyle = `rgba(${r}, ${g}, ${b}, 0.65)`;
      offScreenContext.globalCompositeOperation = "source-atop";

      offScreenContext.fillRect(0, 0, tileSize, tileSize);
      offScreenContext.globalCompositeOperation = "source-over";

      context.drawImage(offScreenCanvas, x, z, tileSize, tileSize);
    }
  }
}

export function drawTileCoordinates(terrain) {
  const { tileSize } = TerrainConfig;
  const context = getContext();

  for (const [rowIndex, row] of terrain.entries()) {
    for (const [tileIndex, tile] of row.entries()) {
      const { x, z } = tile;

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        `${tileIndex}, ${rowIndex}`,
        x + tileSize / 2,
        z + tileSize / 3
      );
    }
  }
}
