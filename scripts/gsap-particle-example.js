console.clear()

gsap.registerPlugin(MorphSVGPlugin)

gsap.defaults({
  ease: 'power4.inOut',
})

// Fake SVG path element
class PathProxy {
  constructor(d, width, height, resolution) {
    this.nodeName = 'path'
    this.d = d
    this.resolution = resolution
    this.canvas = document.createElement('canvas')
    this.canvas.width = width * resolution
    this.canvas.height = height * resolution
    this.context = this.canvas.getContext('2d')
    this.context.fillStyle = '#fff'
    this.texture = PIXI.Texture.fromCanvas(this.canvas)
  }

  getAttribute(attr) {
    return this[attr]
  }

  getAttributeNS(ns, attr) {
    return this[attr]
  }

  setAttribute(attr, value) {
    this[attr] = value
  }

  setAttributeNS(ns, attr, value) {
    this[attr] = value
  }

  update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.fill(new Path2D(this.d))
    this.texture.update()
  }
}

let vw = window.innerWidth
let vh = window.innerHeight

let resized = false
let resolution = Math.min(window.devicePixelRatio || 1, 2)

let app = new PIXI.Application(vw, vh, {
  backgroundColor: 0x000000,
  view: document.getElementById('stage'),
  resolution: resolution,
  autoResize: true,
})

let paths = gsap.utils.toArray('.shape').map((path) => path.getAttribute('d'))

let container = new PIXI.Container()
app.stage.addChild(container)

let path = new PathProxy(paths[0], 137, 153, resolution)

let d = 1.5

let tl = gsap
  .timeline({ repeat: -1 })
  .to(path, d, { morphSVG: paths[1] })
  .to(path, d, { morphSVG: paths[2] })
  .to(path, d, { morphSVG: paths[3] })
  .to(path, d, { morphSVG: paths[4] })
  .to(path, d, { morphSVG: paths[5] })
  .to(path, d, { morphSVG: paths[6] })
  .to(path, d, { morphSVG: paths[0] })

let emitter = new PIXI.particles.Emitter(container, [path.texture], {
  alpha: {
    start: 0.5,
    end: 0,
  },
  scale: {
    start: 0.25,
    end: 0.75,
    minimumScaleMultiplier: 0.5,
  },
  color: {
    start: '#e4f9ff',
    end: '#3fcbff',
  },
  speed: {
    start: 200,
    end: 50,
    minimumSpeedMultiplier: 1,
  },
  acceleration: {
    x: 0,
    y: 0,
  },
  maxSpeed: 0,
  startRotation: {
    min: 0,
    max: 360,
  },
  noRotation: false,
  rotationSpeed: {
    min: 5,
    max: 10,
  },
  lifetime: {
    min: 4,
    max: 8,
  },
  blendMode: 'normal',
  frequency: 0.007,
  emitterLifetime: -1,
  maxParticles: 5000,
  pos: {
    x: 0,
    y: 0,
  },
  addAtBack: false,
  spawnType: 'point',
})

app.stage.interactive = true

app.stage.on('pointermove', (event) => {
  let global = event.data.global
  emitter.updateOwnerPos(global.x, global.y)
})

app.ticker.add(() => {
  if (resized) {
    resize()
    resized = false
  }

  path.update()
  emitter.update(app.ticker.elapsedMS * 0.001)
})

window.addEventListener('resize', () => (resized = true))

function resize() {
  vw = window.innerWidth
  vh = window.innerHeight
  app.renderer.resize(vw, vh)
}

console.log('PATH', path)
