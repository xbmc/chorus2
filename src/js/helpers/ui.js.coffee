###
  UI helpers for the app.
###
helpers.ui = {}

## Bind to scroll and resize stop. This should only be bound once during app init.
helpers.ui.bindOnScrollResize = () ->
  $(window).scrollStopped =>
    helpers.ui.requestTick()
  $(window).resizeStopped =>
    helpers.ui.requestTick()

## Callback for resize/scroll stop, it uses requestAnimationFrame to trigger an event
## when scrolling has actually stopped, this prevents locking the UI with a redraw.
## Views, etc can listen to App.vent.on("ui:animate:stop") to trigger redraws.
## Used by VirtualListView.
helpers.ui.isTicking = false
helpers.ui.requestTick = () ->
  if !helpers.ui.isTicking
    requestAnimationFrame( =>
      Kodi.vent.trigger "ui:animate:stop"
      helpers.ui.isTicking = false
    )
  helpers.ui.isTicking = true

## Get a swatch from an image (Vibrant.js)
helpers.ui.getSwatch = (imgSrc, callback) ->
  ret = {}
  img = document.createElement('img');
  img.setAttribute('src', imgSrc)
  img.addEventListener 'load', ->
    vibrant = new Vibrant(img);
    swatches = vibrant.swatches()
    for swatch of swatches
      if swatches.hasOwnProperty(swatch) and swatches[swatch]
        sw = swatches[swatch]
        ret[swatch] = {
          hex: sw.getHex()
          rgb: _.map sw.getRgb(), (c) -> Math.round(c)
          title: sw.getTitleTextColor()
          body: sw.getBodyTextColor()
        }
    callback(ret)

## Apply swatches to a header (Vibrant.js)
helpers.ui.applyHeaderSwatch = (swatches) ->
  if swatches? and swatches.DarkVibrant? and swatches.DarkVibrant.hex?
    # Check enabled first before applying.
    if config.get('static', 'vibrantHeaders') is true
      color = swatches.DarkVibrant
      # Header background.
      $header = $('.details-header')
      $header.css('background-color', color.hex)
      # Fanart gradient
      rgb = color.rgb.join(',')
      gradient = 'linear-gradient(to right, ' + color.hex + ' 0%, rgba(' + rgb + ',0.9) 30%, rgba(' + rgb + ',0) 100%)'
      $('.region-details-fanart .gradient', $header).css('background-image', gradient)
