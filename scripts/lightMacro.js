async function createGhostLight() {
  let brightRadius = 0
  let dimRadius = 4
  let lightColor = '#66eb75'
  //let x = canvas.scene._viewPosition.x
  //let y = canvas.scene._viewPosition.y
  let x = 0
  let y = 0
  let ghostAnimation = {
    intensity: 5,
    reverse: false,
    speed: 3,
    type: 'ghost',
  }

  let ghostlylight = await canvas.scene.createEmbeddedDocuments(
    'AmbientLight',
    [
      {
        x: x,
        y: y,
        rotation: 0,
        config: {
          dim: dimRadius,
          bright: brightRadius,
          angle: 360,
          color: lightColor,
          coloration: 6,
          alpha: 0.25,
          gradual: true,
          contrast: 0,
          shadows: 0,
          vision: false,
          walls: false,
          animation: ghostAnimation,
        },
      },
    ],
  )
  return ghostlylight
}

createGhostLight()
