//Use this macro to create a light that will illuminate the scene for everyone in the scene and then the light will vanish leaving the map 'explored' but monsters hidden until they're in line of sight.  If you have any players not in the scene, they will not get the benefit of this 'exploration'.

const dimensions = canvas.scene.dimensions
let [created_light] = await canvas.scene.createEmbeddedDocuments(
  'AmbientLight',
  [
    {
      dim: dimensions.maxR,
      vision: true,
      walls: false,
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    },
  ],
)
await new Promise((r) => setTimeout(r, 100))
await created_light.update({ hidden: true })
await created_light.delete()
