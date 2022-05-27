let socket //instance variable for socketLib

let ghost
let pathOne =
  'M1603,2474c36,7.5,90.2,8.7,111.9-21.2c24-33-20.3-69,3.5-177.5c18.3-83.6,95-103.1,154.7-99.4 c110,7,141.5-8.5,204.5,126.5c49.5,106.1,265.9-58.5,304.5-219c20.5-85.5-396-105-327,19.5c50.5,91.1,132.8,44.6,184.5,66 c32.6,13.5,21.5,146,49.5,154.5c57.9,17.6,95.3-25.5,124.5-97.5c32.9-81-3.2-227.3,53.5-202c65,29-7.5,152.1,43.9,159.4 c80.4,11.5,167,10.3,214.1-14.4c63.1-33.2,24.9-131.7,161.4-140.7s180,22.5,484.5-33c151.9-27.7,273-15,435,0 s160.7-51.1,169.5-103.5c7.9-46.9,16.8-125-45.4-203.8'

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
}

import gsap, {
  MotionPathPlugin,
  PixiPlugin,
} from '/scripts/greensock/esm/all.js'

Hooks.on('init', function () {
  // once set up, we create our API object. Each function needs an entry
  game.modules.get('footsteps-of-otari').api = {
    doTheThing: FootstepsOfOtari.doTheThing,
    makeCircle: FootstepsOfOtari.makeCircle,
    makeGhost: FootstepsOfOtari.makeGhost,
  }
  // now that we've created our API, inform other modules we are ready
  // provide a reference to the module api as the hook arguments for good measure
  Hooks.callAll('FootstepsOfOtari', game.modules.get('footsteps-of-otari').api)
})

Hooks.once('ready', async () => {
  gsap.registerPlugin(MotionPathPlugin, PixiPlugin)

  // Set up  main socket listener
  game.socket.on('module.footsteps-of-otari', (data) => {
    console.log('footsteps-of-otari.hook type: ' + data.type)
  })

  // Socketlib test functions
  // Let's send a greeting to all other connected users.
  socket.executeForEveryone('hello', game.user.name)
  // ...or by passing in the function that you'd like to call.
  socket.executeForEveryone(showHelloMessage, game.user.name)
  // The following function will be executed on a GM client.
  const result = await socket.executeAsGM('add', 5, 3)
  console.log(`The GM client calculated: ${result}`)

  //Setup complete!
  console.log('<<<<<<<<<< Footsteps of Otari >>>>>>>>>>')
})

Hooks.once('socketlib.ready', () => {
  //register module
  socket = socketlib.registerModule('footsteps-of-otari')
  //register socket functions
  socket.register('hello', showHelloMessage)
  socket.register('add', add)
  socket.register('doStuff', doStuff)
  socket.register('createPixi', createPixi)
  socket.register('createGhost', createGhost)
})

function showHelloMessage(userName) {
  console.log(`User ${userName} says hello!`)
}

function add(a, b) {
  console.log('The addition is performed on a GM client.')
  return a + b
}

function doStuff() {
  gsap.to(ghost, {
    motionPath: pathOne,
    yoyo: true,
    duration: 20,
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
  const ghostTexture = await loadTexture(
    'modules/footsteps-of-otari/artwork/ghost-blob.webp',
  )
  ghost = new PIXI.Sprite(ghostTexture)
  ghost.name = 'otariOne'
  ghost.anchor.set(0.5)
  ghost.x = 400
  ghost.y = 300
  canvas.app.stage.addChild(ghost)
}
