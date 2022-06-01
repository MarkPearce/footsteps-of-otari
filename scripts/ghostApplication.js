/**
 * Define your class that extends FormApplication
 */
export class GhostApplication extends FormApplication {
  constructor(exampleOption) {
    super()
    //this.exampleOption = exampleOption
    this.totalProgress = 0
  }

  static get defaultOptions() {
    const _default = super.defaultOptions
    return mergeObject(_default, {
      popOut: true,
      template: `./modules/footsteps-of-otari/scripts/ghostApplication.hbs`,
      id: 'footsteps-of-otari',
      title: 'Footsteps of Otari',
      width: 480,
      classes: [..._default.classes, 'footsteps'],
      closeOnSubmit: false,
      submitOnClose: false,
      submitOnChange: false,
    })
  }

  getData() {
    // Send data to the template
    return {
      //  msg: this.exampleOption,
      // color: 'red',
      progressBar: this.totalProgress * 100,
    }
  }

  async _updateObject(event, formData) {
    console.log(formData.exampleInput)
    this.render() // rerenders the FormApp with the new data.
  }

  activateListeners(html) {
    super.activateListeners(html)
    // let timelineSlider = html.find('#ghostTimelineSlider')
    let timelineSlider = html.find('.footsteps-of-otari-timelineSlider')
    timelineSlider.mousedown((event) => this.mousedownGhostSlider(event))

    timelineSlider.on('input', (event) => {
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
