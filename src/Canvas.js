/**
 * @returns {HTMLCanvasElement}
 */
export function getCanvas() {
  return document.getElementById("canvas")
}

/**
 * @callback RenderCanvasCallback
 */

/**
 * @param {RenderCanvasCallback} callback
 */
export function renderCanvas(callback) {
  callback()
  window.requestAnimationFrame(() => renderCanvas(callback))
}

/**
 * @returns {CanvasRenderingContext2D}
 */
export function getContext() {
  return getCanvas().getContext("2d")
}

export function clearCanvas() {
  const context = getContext()
  context.clearRect(0, 0, innerWidth, innerHeight)
}
