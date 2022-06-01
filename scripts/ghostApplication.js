/**
 * Define your class that extends FormApplication
 */
export class GhostApplication extends FormApplication {
  constructor(exampleOption) {
    super()
    this.exampleOption = exampleOption
    this.totalProgress = 0
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['form'],
      popOut: true,
      template: `./modules/footsteps-of-otari/scripts/ghostApplication.html`,
      id: 'footsteps-of-otari',
      title: 'Footsteps of Otari',
      width: 320,
    })
  }

  getData() {
    // Send data to the template
    return {
      msg: this.exampleOption,
      color: 'red',
      progressBar: this.totalProgress * 100,
    }
  }

  async _updateObject(event, formData) {
    console.log(formData.exampleInput)
    this.render() // rerenders the FormApp with the new data.
  }

  activateListeners(html) {
    super.activateListeners(html)
    let ghostTimelineSlider = html.find('#ghostTimelineSlider')
    ghostTimelineSlider.mousedown((event) => this.mousedownGhostSlider(event))

    ghostTimelineSlider.on('input', (event) => {
      this.dragGhostSlider(event)
    })
  }

  dragGhostSlider(event) {
    //not called by onInput
    console.log('dragSlider' + event.currentTarget.value)
  }

  mousedownGhostSlider(event) {
    console.log('mousedown')
    console.dir(event)
  }
}

window.GhostApplication = GhostApplication
