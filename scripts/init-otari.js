let socket //instance variable for socketLib

class FootstepsOfOtari {
  //API Functions below

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
}

import gsap, {
  MotionPathPlugin,
  PixiPlugin,
} from '/scripts/greensock/esm/all.js'

Hooks.on('init', function () {
  // once set up, we create our API object. Each funtion needs an entry
  game.modules.get('footsteps-of-otari').api = {
    doTheThing: FootstepsOfOtari.doTheThing,
    makeCircle: FootstepsOfOtari.makeCircle,
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
})

function showHelloMessage(userName) {
  console.log(`User ${userName} says hello!`)
}

function add(a, b) {
  console.log('The addition is performed on a GM client.')
  return a + b
}

function doStuff() {
  console.log('ok')
  console.log('do')
  console.log('the')
  console.log('thing')
}

function createPixi() {
  console.log('createPixi')
  const g = new PIXI.Graphics()
  g.beginFill(0x0000dd)
  g.drawRect(0, 0, 200, 200)
  g.endFill()
  canvas.app.stage.addChild(g)
}
