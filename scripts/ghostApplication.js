/**
 * Define your class that extends FormApplication
 */
export class GhostApplication extends FormApplication {
  constructor(exampleOption) {
    super()
    this.totalProgress = 0
    this.playbackSpeed = 1
    this.mapVersion = 'remaster'
    this.mapLevel = 'two'
    this.playIcon
    this.pauseIcon
    this.timelineSlider
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
      progressBar: this.totalProgress * 100,
    }
  }

  async _updateObject(event, formData) {
    console.log(formData.exampleInput)
    //this.render() // rerenders the FormApp with the new data.
  }

  /////////////////////////////
  // Controller UI Listeners //
  /////////////////////////////

  activateListeners(html) {
    super.activateListeners(html)
    this.playIcon = html.find('.fa-play')
    this.pauseIcon = html.find('.fa-pause')
    //timeline slider
    this.timelineSlider = html.find('.footsteps-of-otari-timelineSlider')
    this.timelineSlider.mousedown((event) => this.mousedownGhostSlider(event))
    this.timelineSlider.on('input', (event) => {
      this.dragGhostSlider(event)
    })
    this.timelineSlider.on('change', (event) => {
      this.changeGhostSlider(event)
    })
    //Version radios
    html
      .find('input:radio[name=footsteps-of-otari-map-version]')
      .change((event) => this.radioVersion(event))
    //Level radios
    html
      .find('input:radio[name=footsteps-of-otari-floor]')
      .change((event) => this.radioLevel(event))
    //play button
    html
      .find('.footsteps-of-otari-playControl')
      .click((event) => this.buttonPlayToggle(event))
    //create button
    html
      .find('.footsteps-of-otari-create')
      .click((event) => this.buttonCreate(event))

    //remove button
    html
      .find('.footsteps-of-otari-erase')
      .click((event) => this.buttonRemove(event))
    //speed selector
    html
      .find('.footsteps-of-otari-playSpeed')
      .change((event) => this.selectSpeed(event))
  }

  /////////////////////////////
  // Controller Functions    //
  /////////////////////////////

  dragGhostSlider(event) {
    //not called by onInput
    this.totalProgress = event.currentTarget.value / 100
    console.log('dragSlider' + this.totalProgress)
    game.modules
      .get('footsteps-of-otari')
      ?.api?._dragGhostSlider(this.totalProgress)
  }

  mousedownGhostSlider(event) {
    console.log('mousedown slider')
    game.modules.get('footsteps-of-otari')?.api?._mousedownGhostSlider()
  }

  changeGhostSlider(event) {
    this.totalProgress = event.currentTarget.value / 100
    console.log('release slider' + this.totalProgress)
    game.modules
      .get('footsteps-of-otari')
      ?.api?._changeGhostSlider(this.totalProgress)
  }

  buttonPlayToggle(event) {
    game.modules.get('footsteps-of-otari')?.api?._playToggle()
  }

  radioVersion(event) {
    this.mapVersion = event.currentTarget.value
    game.modules
      .get('footsteps-of-otari')
      ?.api?._selectMapVersion(this.mapVersion)
  }

  radioLevel(event) {
    this.mapLevel = event.currentTarget.value
    game.modules.get('footsteps-of-otari')?.api?._selectMapLevel(this.mapLevel)
  }

  buttonRemove(event) {
    game.modules.get('footsteps-of-otari')?.api?._removeGhosts()
  }

  buttonCreate(event) {
    game.modules.get('footsteps-of-otari')?.api?._makeGhost()
  }

  selectSpeed(event) {
    this.playbackSpeed = Number(event.currentTarget.value)
    game.modules
      .get('footsteps-of-otari')
      ?.api?._setPlaybackSpeed(this.playbackSpeed)
  }

  /////////////////////////////
  // Called from core module  //
  //////////////////////////////

  setToggleButton(isPlaying) {
    console.log('setToggleButton ' + isPlaying)
    if (isPlaying == true) {
      this.playIcon.css('display', 'none')
      this.pauseIcon.css('display', 'block')
    } else {
      console.log('why you broken')
      this.playIcon.css('display', 'block')
      this.pauseIcon.css('display', 'none')
    }
  }

  updateTimeline() {
    this.timelineSlider.val(this.totalProgress * 100)
  }
}

window.GhostApplication = GhostApplication
