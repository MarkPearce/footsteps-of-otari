///////////////////
//     SETUP     //
///////////////////

import gsap, {
  MotionPathPlugin,
  PixiPlugin,
} from '/scripts/greensock/esm/all.js'

let socket //instance variable for socketLib

let childNum = 0 //temp
let tempNum = 0 //

let ghostContainer = new PIXI.Container()
let ghostNull = new PIXI.Container()
let ghost //sprite
let ghostLight
let ghostEmitter
let pathOne =
  'M1603,2474c36,7.5,90.2,8.7,111.9-21.2c24-33-20.3-69,3.5-177.5c18.3-83.6,95-103.1,154.7-99.4 c110,7,141.5-8.5,204.5,126.5c49.5,106.1,265.9-58.5,304.5-219c20.5-85.5-396-105-327,19.5c50.5,91.1,132.8,44.6,184.5,66 c32.6,13.5,21.5,146,49.5,154.5c57.9,17.6,95.3-25.5,124.5-97.5c32.9-81-3.2-227.3,53.5-202c65,29-7.5,152.1,43.9,159.4 c80.4,11.5,167,10.3,214.1-14.4c63.1-33.2,24.9-131.7,161.4-140.7s180,22.5,484.5-33c151.9-27.7,273-15,435,0 s160.7-51.1,169.5-103.5c7.9-46.9,16.8-125-45.4-203.8'

let pathTwo =
  'M2370,6243c-108,0-168,18-189-66s-18-291,0-345s120,7.5,162-141c21.7-76.9,57-63,159-63s327,13.5,373.5-12 s57-97.5,57-157.5s8.1-113.8-4.5-96c-18,25.5-19.5,102-10.5,145.5s-7.5,105,61.5,120s235.5,4.5,366,7.5s244.3,20.5,305.7-76.8 c59.1-93.8,114.7-192,133.3-512c11.7-201-91.3-299.8,34.7-385.3S4254,4551,4446,4575s58.9,223.2,242,289 c59.3,21.3,189.3,25.3,362.7,4c104.5-12.9,260,4.9,393.3,10.7c189.3,8.2,349.1,8.5,386.7,2.7c149.9-23.4,70.1-240.5,141.3-294.7 c25.3-19.3,213.3-19.3,238,24.3c35,61.9,14.4,329.2,6,372'

/////////////////////////////
//    API DEFININITION     //
/////////////////////////////

class FootstepsOfOtari {
  //API Functions below : must be registered with API and SOCKET

  static doTheThing(argument, userID = null) {
    // does stuff you want other modules to have access to
    console.log('the thing is: ' + argument)
    if (argument == 'doStuff') {
      if (userID != null) {
        socket.executeForUsers(doStuff, [userID])
      } else {
        socket.executeForEveryone(doStuff)
      }
    }
  }

  static makeCircle() {
    console.log('make a circle')
    socket.executeForEveryone(createPixi)
  }

  static makeGhost() {
    console.log('make a ghost')
    socket.executeForEveryone(createGhost)
  }

  static nameChild() {
    socket.executeForEveryone(nameChild)
  }
}

/////////////////////////////////
//    SYSTEM AND API HOOKS     //
/////////////////////////////////

Hooks.on('init', function () {
  // once set up, we create our API object. Each function needs an entry
  game.modules.get('footsteps-of-otari').api = {
    doTheThing: FootstepsOfOtari.doTheThing,
    makeCircle: FootstepsOfOtari.makeCircle,
    makeGhost: FootstepsOfOtari.makeGhost,
    nameChild: FootstepsOfOtari.nameChild,
  }
  // now that we've created our API, inform other modules we are ready
  // provide a reference to the module api as the hook arguments for good measure
  Hooks.callAll('FootstepsOfOtari', game.modules.get('footsteps-of-otari').api)
})

Hooks.once('ready', async () => {
  gsap.registerPlugin(MotionPathPlugin, PixiPlugin)
  // Set up  main socket listener -- reduntant now? TODO - Remove?
  /*
  game.socket.on('module.footsteps-of-otari', (data) => {
    console.log('footsteps-of-otari.hook type: ' + data.type)
  })
  */
  //Setup complete
  console.log('<<<<<<<<<< Footsteps of Otari >>>>>>>>>>')
})

Hooks.once('socketlib.ready', () => {
  //register module
  socket = socketlib.registerModule('footsteps-of-otari')
  //register socket functions
  socket.register('doStuff', doStuff)
  socket.register('createPixi', createPixi)
  socket.register('createGhost', createGhost)
  socket.register('nameChild', nameChild)
})

//////////////////////////
//    API FUNCTIONS     //
//////////////////////////

function doStuff() {
  gsap.to(ghostNull, {
    motionPath: pathTwo,
    duration: 66,
  })
}

function createPixi() {
  console.log('createPixi')
  const g = new PIXI.Graphics()
  g.beginFill(0x55e08f)
  g.drawCircle(100, 200, 100)
  g.endFill()
  canvas.app.stage.addChild(g)
}

async function createGhost() {
  console.log('createGhost')
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
  //
  const leftFoot = await loadTexture(
    'modules/footsteps-of-otari/artwork/ghost-left.webp',
  )
  const rightFoot = await loadTexture(
    'modules/footsteps-of-otari/artwork/ghost-left.webp',
  )

  // Ghost Aura Particles
  let now = Date.now()
  ghostEmitter = new PIXI.particles.Emitter(
    // The PIXI.Container to put the emitter in
    // if using blend modes, it's important to put this
    // on top of a bitmap, and not use the root stage Container
    ghostNull,

    // The collection of particle images to use
    //[PIXI.Texture.fromImage('image.jpg')],
    [ghostTexture],

    // Emitter configuration, edit this to change the look
    // of the emitter
    {
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 0.1, minimumScaleMultiplier: 1 },
      color: { start: '#4af095', end: '#169e0c' },
      speed: { start: 20, end: 5, minimumSpeedMultiplier: 0 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 0,
      startRotation: { min: 0, max: 360 },
      noRotation: true,
      rotationSpeed: { min: 0, max: 0 },
      lifetime: { min: 0.5, max: 1.8 },
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
  ghostEmitter.parent = ghostContainer

  // Particle updater
  canvas.app.ticker.add(() => {
    const newNow = Date.now()
    ghostEmitter.update((newNow - now) * 0.001)
    ghostEmitter.updateOwnerPos(ghostNull.x, ghostNull.y)
    now = newNow
  })

  // TODO Light Follow

  //add to background
  ghostContainer.addChild(ghostNull)
  canvas.background.addChild(ghostContainer)
}

async function nameChild() {
  if (game.user.isGM) {
    console.log('nameChild' + childNum)
    console.log('child name:' + canvas.app.stage.getChildAt(childNum).name)
    childNum++
  }
}

///////////////////////////////
//    INTERNAL FUNCTIONS     //
///////////////////////////////
