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

    // set radio values based on map
    let radioVersionClassic = html.find(
      '.footsteps-of-otari-radioVersionClassic',
    )
    let radioVersionRemaster = html.find(
      '.footsteps-of-otari-radioVersionRemaster',
    )
    if (this.mapVersion == 'remaster') {
      radioVersionRemaster[0].checked = true
    } else {
      radioVersionClassic[0].checked = true
    }

    let radioLevelTwo = html.find('.footsteps-of-otari-radioLevelTwo')
    let radioLevelThree = html.find('.footsteps-of-otari-radioLevelThree')
    let radioLevelFour = html.find('.footsteps-of-otari-radioLevelFour')

    if (this.mapLevel == 'two') {
      radioLevelTwo[0].checked = true
    }
    if (this.mapLevel == 'three') {
      radioLevelThree[0].checked = true
    }
    if (this.mapLevel == 'four') {
      radioLevelFour[0].checked = true
    }
  }

  /////////////////////////////
  // Controller Functions    //
  /////////////////////////////

  dragGhostSlider(event) {
    this.totalProgress = event.currentTarget.value / 100
    game.modules
      .get('footsteps-of-otari')
      ?.api?._dragGhostSlider(this.totalProgress)
  }

  mousedownGhostSlider(event) {
    game.modules.get('footsteps-of-otari')?.api?._mousedownGhostSlider()
  }

  changeGhostSlider(event) {
    this.totalProgress = event.currentTarget.value / 100
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
    if (isPlaying == true) {
      this.playIcon.css('display', 'none')
      this.pauseIcon.css('display', 'block')
    } else {
      this.playIcon.css('display', 'block')
      this.pauseIcon.css('display', 'none')
    }
  }

  updateTimeline() {
    this.timelineSlider.val(this.totalProgress * 100)
  }
}

window.GhostApplication = GhostApplication
