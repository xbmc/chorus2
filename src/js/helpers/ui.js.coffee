###
  UI helpers for the app.
###
helpers.ui = {}

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
