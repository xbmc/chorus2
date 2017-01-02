
## Soundmanager config.
## Must be run before app init

soundManager.setup({
  url: 'lib/soundmanager/swf/'
  flashVersion: 9
  preferFlash: true
  useHTML5Audio: true
  useFlashBlock: false
  flashLoadTimeout: 3000
  debugMode: false
  noSWFCache: true
  debugFlash: false
  flashPollingInterval: 1000
  html5PollingInterval: 1000
  onready: ->
    $(window).trigger 'audiostream:ready'
  ontimeout: ->
    $(window).trigger 'audiostream:timeout'
    soundManager.flashLoadTimeout = 0 # When restarting, wait indefinitely for flash
    soundManager.onerror = {} # Prevent an infinite loop, in case it's not flashblock
    soundManager.reboot()  # Reboot
})
