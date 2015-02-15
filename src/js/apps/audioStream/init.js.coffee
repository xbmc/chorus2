
## Soundmanager config.
## Must be run before app init

soundManager.setup({
  url: 'lib/soundmanager/swf/',
  flashVersion: 9,
  preferFlash: true,
  useHTML5Audio: true,
  useFlashBlock: false,
  flashLoadTimeout: 3000,
  debugMode: true,
  noSWFCache: true,
  debugFlash: false,
  onready: ->
    console.log 'sm ready!!'
  ontimeout: ->
    console.log 'sm timout!!'
    soundManager.flashLoadTimeout = 0 # When restarting, wait indefinitely for flash
    soundManager.onerror = {} # Prevent an infinite loop, in case it's not flashblock
    soundManager.reboot()  # Reboot
})
