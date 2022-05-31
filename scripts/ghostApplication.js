/**
 * Define your class that extends FormApplication
 */
export class GhostApplication extends FormApplication {
  constructor(exampleOption) {
    super()
    this.exampleOption = exampleOption
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['form'],
      popOut: true,
      template: `./modules/footsteps-of-otari/scripts/ghostApplication.html`,
      id: 'footsteps-of-otari',
      title: 'Footsteps of Otari',
    })
  }

  getData() {
    // Send data to the template
    return {
      msg: this.exampleOption,
      color: 'red',
    }
  }

  activateListeners(html) {
    super.activateListeners(html)
  }

  async _updateObject(event, formData) {
    console.log(formData.exampleInput)
  }
}

window.GhostApplication = GhostApplication
