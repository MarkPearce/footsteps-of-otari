///////////////////
//     SETUP     //
///////////////////

import gsap, {
  MotionPathPlugin,
  PixiPlugin,
} from '/scripts/greensock/esm/all.js'

//////////////////////////////////
////// Controls Application //////
//////////////////////////////////

let socket //instance variable for socketLib
import { GhostApplication } from './ghostApplication.js'
let ghostUpdateRate = 0 //counter for the number of greensock updates events before we update socket for gm ghost control dialog

let isPlaying = false
let playbackSpeed = 1
let mapVersion = 'remaster'
let mapLevel = 2
let ghostExists = false // is there a ghost?

let ghostApplication = new GhostApplication(
  0,
  isPlaying,
  playbackSpeed,
  mapVersion,
  mapLevel,
  ghostExists,
) // pass initial props

/////////////////////////////////////////
///  Ghost animation and PIXI stuff   //
////////////////////////////////////////

let ghostTimeline = gsap.timeline({ onUpdate: ghostUpdater, paused: true }) //TODO progress and animate placable
//let ghostTimeline = gsap.timeline({ paused: true })

let ghostContainer = new PIXI.Container()
let ghostNull = new PIXI.Container()
let ghost //sprite
let ghostLight
let ghostEmitter // aura particles
let leftPrintEmitter
let rightPrintEmitter
let stepFrequency = 1.5
let now // timer
let ghostPath

////// Remaster Maps ///////
let levelTwo =
  'M5266.7,3306.7c62.2,78.9,66.6,188.3,58.7,235.2c-8.8,52.4-7.5,118.5-169.5,103.5s-283.1-27.7-435,0 c-304.5,55.5-348,24-484.5,33s-81,134.3-152.1,140c-50.6,4-159.7,38.2-229.6,1.7c-35.9-18.8,21-139.8-64-146.7 c-36.6-2.9,5.7,121.7-27.2,202.7c-29.2,72-66.6,115.1-124.5,97.5c-28-8.5-16.9-141-49.5-154.5c-51.7-21.4-134,25.1-184.5-66 c-69-124.5,347.5-105,327-19.5c-38.6,160.5-255,325.1-304.5,219c-63-135-184.4-127.6-201.9-129c-108-9-138.9,18.3-157.2,101.9 c-23.8,108.5,12.2,153-11.8,186c-21.7,29.8-97.9,35.3-123.2-6c-19.7-32.2-21.3-214.7-12-265.3'

let levelThree =
  'M2370,6243c-108,0-168,18-189-66s-18-291,0-345s120,7.5,162-141c21.7-76.9,57-63,159-63s327,13.5,373.5-12 s57-97.5,57-157.5s8.1-113.8-4.5-96c-18,25.5-19.5,102-10.5,145.5s-7.5,105,61.5,120s235.5,4.5,366,7.5s244.3,20.5,305.7-76.8 c59.1-93.8,114.7-192,133.3-512c11.7-201-91.3-299.8,34.7-385.3S4254,4551,4446,4575s58.9,223.2,242,289 c59.3,21.3,189.3,25.3,362.7,4c104.5-12.9,260,4.9,393.3,10.7c189.3,8.2,349.1,8.5,386.7,2.7c149.9-23.4,70.1-240.5,141.3-294.7 c25.3-19.3,213.3-19.3,238,24.3c35,61.9,14.4,329.2,6,372'

let levelFour =
  'M6034.5,5625c-127.5,4.5-249-18-363-1.5s-258,39-321-15s-33-292.5-66-358.5s-55.5,40.5-112.5,3 s-171,25.5-145.5,81s154.5,72,187.5,121.5s-126.4,19.7-156,49.5c-31.3,31.5,97.5,112.5,46.5,123s-228.9-89.1-247.5-106.5 c-36.5-34.1-127.3,26.4-139.5,100.5c-12.1,73.7-145.5,72-157.5,118.5s-67.5,378-42,528s-55.5,325.5-81,439.5 c-20.4,91.1,39,274.5,27,429s43.5,304.5,82.5,342s207,126,307.5,105s228-43.5,370.5,19.5S5525,7584,5525,7584'

/////////////////////////////
//    API DEFININITION     //
/////////////////////////////

class FootstepsOfOtari {
  //API Functions below : must be registered with API and SOCKET

  static _doTheThing(argument) {
    // does stuff you want other modules to have access to
    socket.executeForEveryone(doTheThing, [argument])
  }

  static _makeGhost() {
    console.log('make a ghost')
    socket.executeForEveryone(makeGhost)
  }

  static _removeGhosts() {
    socket.executeForEveryone(removeGhosts)
  }

  static _openFootstepsController() {
    socket.executeAsGM(openFootstepsController)
  }

  static _selectMapVersion(version) {
    socket.executeForEveryone(selectMapVersion)
  }

  static _selectMapLayer(mapNumber) {
    socket.executeForEveryone(selectMapLayer)
  }

  static _playToggle() {
    socket.executeForEveryone(playToggle)
  }

  static _mousedownGhostSlider() {
    socket.executeForEveryone(mousedownGhostSlider)
  }

  static _changeGhostSlider() {
    socket.executeForEveryone(changeGhostSlider)
  }

  static _dragGhostSlider() {
    socket.executeForEveryone(dragGhostSlider)
  }

  static _setPlaybackSpeed() {
    socket.executeForEveryone(setPlaybackSpeed)
  }
}

/////////////////////////////////
//    SYSTEM AND API HOOKS     //
/////////////////////////////////

Hooks.on('init', function () {
  // once set up, we create our API object. Each function needs an entry
  game.modules.get('footsteps-of-otari').api = {
    _doTheThing: FootstepsOfOtari._doTheThing,
    _makeGhost: FootstepsOfOtari._makeGhost,
    _removeGhosts: FootstepsOfOtari._removeGhosts,
    _openFootstepsController: FootstepsOfOtari._openFootstepsController,
  }
  // now that we've created our API, inform other modules we are ready
  // provide a reference to the module api as the hook arguments for good measure
  Hooks.callAll('FootstepsOfOtari', game.modules.get('footsteps-of-otari').api)
})

Hooks.on('canvasInit', async () => {
  //get rid of all ghosts
  removeGhosts()
})

Hooks.on('closeGhostApplication', async () => {
  //get rid of all ghosts
  removeGhosts()
})

Hooks.once('ready', async () => {
  gsap.registerPlugin(MotionPathPlugin, PixiPlugin)
  //Setup complete
  console.log('<<<<<<<<<< Footsteps of Otari >>>>>>>>>>')
})

Hooks.once('socketlib.ready', () => {
  //register module
  socket = socketlib.registerModule('footsteps-of-otari')
  //register socket functions
  /// ('external name from static above', function in api below)
  socket.register('_doTheThing', doTheThing)
  socket.register('_makeGhost', makeGhost)
  socket.register('_removeGhosts', removeGhosts)
  socket.register('_ghostSocketUpdate', ghostSocketUpdate)
  socket.register('_openFootstepsController', openFootstepsController)
})

//////////////////////////
//    API FUNCTIONS     //
//////////////////////////

function doTheThing(whatLevel) {
  let pathDuration

  if (whatLevel == 'two') {
    ghostPath = levelTwo
    pathDuration = 36
  }

  if (whatLevel == 'three') {
    ghostPath = levelThree
    pathDuration = 66
  }

  if (whatLevel == 'four') {
    ghostPath = levelFour
    pathDuration = 48
  }

  //let ghostParts = [ghostNull, ghostLight] //maybe a light will work?
  let ghostParts = [ghostNull]
  let ghostAnimation = gsap.to(ghostParts, {
    motionPath: { path: ghostPath, autoRotate: 90 },
    duration: pathDuration,
    ease: 'none',
  })
  ghostTimeline.add(ghostAnimation)
  ghostTimeline.play(0)
}

async function makeGhost() {
  //ghost sprite
  const ghostTexture = await loadTexture(
    'modules/footsteps-of-otari/artwork/ghost-blob.webp',
  )
  ghost = new PIXI.Sprite(ghostTexture)
  ghost.name = 'otariOne'
  ghost.anchor.set(0.5)
  ghost.x = 0
  ghost.y = 0
  ghost.blendMode = PIXI.BLEND_MODES.ADD
  ghost.width = 48
  ghost.height = 48
  ghostNull.addChild(ghost)

  now = Date.now()

  // Ghost Aura Particles
  ghostEmitter = new PIXI.particles.Emitter(
    // The PIXI.Container to put the emitter in
    ghostContainer,
    // The collection of particle images to use
    [ghostTexture],
    // Emitter configuration
    {
      alpha: { start: 0.8, end: 0 },
      scale: { start: 0.5, end: 0.1, minimumScaleMultiplier: 1 },
      color: { start: '#4af095', end: '#169e0c' },
      speed: { start: 0, end: 0, minimumSpeedMultiplier: 1 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 20,
      startRotation: { min: 0, max: 0 },
      noRotation: false,
      rotationSpeed: { min: 0, max: 0 },
      lifetime: { min: 0.8, max: 2.1 },
      blendMode: 'add',
      frequency: 0.01,
      emitterLifetime: -1,
      maxParticles: 500,
      pos: { x: 0, y: 0 },
      addAtBack: true,
      spawnType: 'point',
    },
  )

  ghostEmitter.emit = true

  // Left Footstep Particles
  const leftFoot = await loadTexture(
    'modules/footsteps-of-otari/artwork/ghost-left.webp',
  )

  leftPrintEmitter = new PIXI.particles.Emitter(
    // The PIXI.Container to put the emitter in
    ghostContainer,
    // The collection of particle images
    [leftFoot],
    // Emitter configuration
    {
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 0.1, minimumScaleMultiplier: 1 },
      color: { start: '#4af095', end: '#169e0c' },
      speed: { start: 0.01, end: 0, minimumSpeedMultiplier: 0 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 0.01,
      startRotation: { min: 0, max: 0 },
      noRotation: false,
      rotationSpeed: { min: 0, max: 0 },
      lifetime: { min: 20, max: 22 },
      blendMode: 'add',
      frequency: stepFrequency,
      emitterLifetime: -1,
      maxParticles: 100,
      pos: { x: 6, y: 0 },
      addAtBack: true,
      spawnType: 'point',
    },
  )

  leftPrintEmitter.emit = true

  // Right Footstep Particles
  const rightFoot = await loadTexture(
    'modules/footsteps-of-otari/artwork/ghost-right.webp',
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
      lifetime: { min: 20, max: 22 },
      blendMode: 'add',
      frequency: stepFrequency,
      emitterLifetime: -1,
      maxParticles: 100,
      pos: { x: 26, y: 0 },
      addAtBack: true,
      spawnType: 'point',
    },
  )

  rightPrintEmitter.emit = false
  gsap.delayedCall(stepFrequency / 2, startRight)
  // PIXI  updater

  canvas.app.ticker.add(updateLoop)

  // TODO Light Follow
  // ghostLight = createGhostLight()

  //add to background
  ghostContainer.addChild(ghostNull)
  canvas.background.addChild(ghostContainer)

  //old way to open dialog
  /*
  if (game.user.isGM) {
    ghostApplication.render(true)
  }
  */
}

async function removeGhosts() {
  console.log('remove ghosts')
  canvas.app.ticker.remove(updateLoop)
  canvas.background.removeChild(ghostContainer)
  ghostContainer.removeChild(ghostNull)
  ghostNull = new PIXI.Container()
  ghostContainer = new PIXI.Container()
  ghostTimeline.clear()
}

async function openFootstepsController() {
  console.log('open controller')
  ghostApplication.render(true)
}

///////////////////////////////
//    INTERNAL FUNCTIONS     //
///////////////////////////////

function startRight() {
  rightPrintEmitter.emit = true
}

let updateLoop = function particleUpdater() {
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
}

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

async function ghostSocketUpdate() {
  //socket function run on GM to update embedded document/placable show progress etc
  if (game.user.isGM) {
    // console.log('ghostTimeline.totalProgress' + ghostTimeline.totalProgress())
    // if (ghostUpdateRate++ > 30) {
    ghostApplication.exampleOption = ghostTimeline.totalProgress()
    ghostApplication.totalProgress = ghostTimeline.totalProgress()
    ghostApplication.render(true)
    //ghostApplication._updateObject
    // ghostUpdateRate = 0
    // }
    //let lightUpdate = [{ x: 1000, y: 1000 }]
    //game.combat.updateEmbeddedDocuments("Combatant", imgUpdate); // update the lighgt. what light? need id?
  }
}

///////////////////////////////////
//    DEBUG & TEMP FUNCTIONS     //
///////////////////////////////////

async function ghostUpdater() {
  //animation update function
  if (ghostUpdateRate++ > 30) {
    socket.executeAsGM(ghostSocketUpdate)
    ghostUpdateRate = 0
  }
  // send socket to GM
}
