console.clear()

var vw = window.innerWidth
var vh = window.innerHeight

var app = new PIXI.Application(vw, vh, {
  view: document.getElementById('stage'),
  antialias: true,
})

gsap.registerPlugin(MotionPathPlugin, PixiPlugin)

let ghostContainer = new PIXI.Container()
let ghostNull = new PIXI.Container()
let ghost //sprite
let ghostEmitter // aura particles
let leftPrintEmitter //footsteps
let rightPrintEmitter
let stepFrequency = 1

let pathTwo =
  'M81.4,209.4C93.2,159.8,218,10.8,338.6,44.8s175.6,123.7,141.6,189.3s-100.4,77.5-117.6,27.1 c-17.2-50.4-6.9-142-74.6-114.5s-145.6,161.5-17.4,182.4s235.5-24,247.3,35.5c11.8,59.5-13.7,71.4-61.8,70.2 c-48.1-1.1-201.1,4.6-293.1-42.4C137.7,379.6,54.3,322.8,81.4,209.4z'

createGhost()
doStuff()

function doStuff() {
  TweenMax.to(ghostNull, {
    motionPath: { path: pathTwo, autoRotate: 90 },
    duration: 25,
    ease: 'none',
  })
}

async function createGhost() {
  //ghost sprite
  const ghostTexture = PIXI.Texture.from(
    'https://assets.codepen.io/1263068/ghost-blob.webp',
  )
  ghost = new PIXI.Sprite(ghostTexture)
  ghost.name = 'otariOne'
  ghost.anchor.set(0.5)
  ghost.x = 0
  ghost.y = 0
  ghost.width = 48
  ghost.height = 48
  ghostNull.addChild(ghost)

  // Ghost Aura Particles
  let now = Date.now()
  ghostEmitter = new PIXI.particles.Emitter(
    ghostContainer,
    // The collection of particle images to use
    [ghostTexture],
    // Emitter configuration
    {
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 0.1, minimumScaleMultiplier: 1 },
      color: { start: '#4af095', end: '#169e0c' },
      speed: { start: 20, end: 5, minimumSpeedMultiplier: 1 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 0,
      startRotation: { min: 0, max: 0 },
      noRotation: true,
      rotationSpeed: { min: 0, max: 0 },
      lifetime: { min: 0.8, max: 2.0 },
      blendMode: 'normal',
      frequency: 0.01,
      emitterLifetime: -1,
      maxParticles: 500,
      pos: { x: 0, y: 0 },
      addAtBack: true,
      spawnType: 'point',
    },
  )

  ghostEmitter.emit = true

  // left Footstep Particles
  const leftFoot = PIXI.Texture.from(
    'https://assets.codepen.io/1263068/ghost-left.webp',
  )

  leftPrintEmitter = new PIXI.particles.Emitter(
    // The PIXI.Container to put the emitter in
    ghostContainer,
    // The collection of particle images to use
    [leftFoot],
    // Emitter configuration
    {
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 0.1, minimumScaleMultiplier: 1 },
      color: { start: '#4af095', end: '#169e0c' },
      speed: { start: 0.01, end: 0, minimumSpeedMultiplier: 0 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 0.1,
      startRotation: { min: 0, max: 0 },
      noRotation: false,
      rotationSpeed: { min: 0, max: 0 },
      lifetime: { min: 16, max: 18 },
      blendMode: 'normal',
      frequency: stepFrequency,
      emitterLifetime: -1,
      maxParticles: 100,
      pos: { x: 16, y: 32 },
      addAtBack: true,
      spawnType: 'point',
    },
  )

  leftPrintEmitter.emit = true

  // Right Footstep Particles
  const rightFoot = PIXI.Texture.from(
    'https://assets.codepen.io/1263068/ghost-right.webp',
  )

  rightPrintEmitter = new PIXI.particles.Emitter(
    // The PIXI.Container to put the emitter in
    ghostContainer,
    // The collection of particle images to use
    [rightFoot],
    // Emitter configuration
    {
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 0.1, minimumScaleMultiplier: 1 },
      color: { start: '#4af095', end: '#169e0c' },
      speed: { start: 0.01, end: 0, minimumSpeedMultiplier: 0 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 0.1,
      startRotation: { min: 0, max: 0 },
      noRotation: false,
      rotationSpeed: { min: 0, max: 0 },
      lifetime: { min: 16, max: 18 },
      blendMode: 'normal',
      frequency: stepFrequency,
      emitterLifetime: -1,
      maxParticles: 100,
      pos: { x: 16, y: 32 },
      addAtBack: true,
      spawnType: 'point',
    },
  )

  rightPrintEmitter.emit = false
  gsap.delayedCall(stepFrequency / 2, startRight)

  app.ticker.add(() => {
    const newNow = Date.now()
    ghostNull.rotation = ghostNull.rotation * (Math.PI / 180)
    ghostEmitter.update((newNow - now) * 0.001)
    ghostEmitter.updateOwnerPos(ghostNull.x, ghostNull.y)
    ghostEmitter.rotate(ghostNull.rotation * (180 / Math.PI))
    leftPrintEmitter.update((newNow - now) * 0.001)
    leftPrintEmitter.updateOwnerPos(ghostNull.x, ghostNull.y)
    leftPrintEmitter.rotate(ghostNull.rotation * (180 / Math.PI))
    rightPrintEmitter.update((newNow - now) * 0.001)
    rightPrintEmitter.updateOwnerPos(ghostNull.x, ghostNull.y)
    rightPrintEmitter.rotate(ghostNull.rotation * (180 / Math.PI))
    now = newNow
  })

  //add to background
  ghostContainer.addChild(ghostNull)
  app.stage.addChild(ghostContainer)
}

function startRight() {
  rightPrintEmitter.emit = true
  gsap.killTweensOf(startRight)
}
