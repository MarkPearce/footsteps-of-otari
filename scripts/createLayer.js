//A sort of basic recipe for adding a custom layer with it's own rendered objects would look something like:
class CustomCanvasObject extends PIXI.Container {
  constructor(data) {
    this.data = data
  }

  async draw() {
    // Define how this object should be rendered
  }
}

class CustomObjectsLayer extends CanvasLayer {
  async draw() {
    await super.draw()
    this.objects = this.addChild(new PIXI.Container())
    const dataArray = canvas.scene.getFlag('myModule', 'myCustomObjectsArray')
    for (let data of dataArray) {
      const object = new CustomCanvasObject(data)
      await object.draw()
      this.objects.addChild(object)
    }
    return this
  }
}

Hooks.on('init', () => {
  CONFIG.Canvas.layers['myLayer'] = {
    layerClass: CustomObjectsLayer,
    group: 'interface',
  }
})
