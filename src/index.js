import { getCanvas, renderCanvas, clearCanvas, getContext } from "./Canvas";

import { Assets } from "./Assets";
import { TerrainConfig } from "./__Config/Terrain.Config";

import { loadAssets } from "./AssetLoader";
import { generateTerrain, drawTerrain } from "./TerrainGenerator";

loadAssets(Assets).then(() => {
  const canvas = getCanvas();

  let mapSize = 32;
  let scale = 0.5;
  let terrain = generateTerrain(mapSize);

  // Initialize sidebar controls
  const sidebar = document.getElementById("sidebar");
  const canvasBackgroundColorPicker = document.querySelector("input#background");

  canvasBackgroundColorPicker.addEventListener("input", (e) => {
    canvas.style.backgroundColor = e.target.value;
    render();
  });

  const mapSizeInput = document.querySelector("input#size");
  mapSizeInput.addEventListener("input", (e) => {
    mapSize = e.target.value;
    terrain = generateTerrain(mapSize);
    render();
  });

  addEventListener("wheel", (event) => {
    scale = Math.min(Math.max(0.25, scale + event.deltaY * -(1 / 1000)), 1.5);
    render();
  });

  // Initialize canvas size
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  function render() {
    clearCanvas();

    const context = getContext();
    context.save();
    context.translate(
      (innerWidth - TerrainConfig.tileSize * scale) / 2,
      innerHeight / 2
    );
    context.scale(scale, scale);
    drawTerrain(terrain);
    context.restore();
  }

  render();
});
