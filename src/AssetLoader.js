export const AssetMap = new Map()

/**
 * @param {string} asset
 * @returns {Promise<HTMLImageElement>}
 */
export function loadAsset(asset) {
  return new Promise((resolve, reject) => {
    const assetName = asset.split("/").pop()

    if (AssetMap.has(assetName)) {
      return resolve(AssetMap.get(assetName))
    }

    const image = new Image()

    image.onload = () => {
      AssetMap.set(assetName, image)
      resolve(image)
    }

    image.onerror = () => {
      console.error(`Failed to load asset: ${assetName}`)
      reject()
    }

    image.src = asset
  })
}

/**
 * @param {string[]} assets
 * @returns {Promise<Map<string, HTMLImageElement>>}
 */
export function loadAssets(assets) {
  return Promise.all(assets.map(loadAsset)).then(() => AssetMap)
}
