// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  UI helpers for the app.
*/
helpers.ui = {};

//# Bind to scroll and resize stop. This should only be bound once during app init.
helpers.ui.bindOnScrollResize = function() {
  $(window).scrollStopped(() => {
    return helpers.ui.requestTick();
  });
  return $(window).resizeStopped(() => {
    return helpers.ui.requestTick();
  });
};

//# Callback for resize/scroll stop, it uses requestAnimationFrame to trigger an event
//# when scrolling has actually stopped, this prevents locking the UI with a redraw.
//# Views, etc can listen to App.vent.on("ui:animate:stop") to trigger redraws.
//# Used by VirtualListView.
helpers.ui.isTicking = false;
helpers.ui.requestTick = function() {
  if (!helpers.ui.isTicking) {
    requestAnimationFrame( () => {
      Kodi.vent.trigger("ui:animate:stop");
      return helpers.ui.isTicking = false;
    });
  }
  return helpers.ui.isTicking = true;
};

//# Get a swatch from an image (Vibrant.js)
helpers.ui.getSwatch = function(imgSrc, callback) {
  const ret = {};
  const img = document.createElement('img');
  img.setAttribute('src', imgSrc);
  return img.addEventListener('load', function() {
    const vibrant = new Vibrant(img);
    const swatches = vibrant.swatches();
    for (var swatch in swatches) {
      if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
        var sw = swatches[swatch];
        ret[swatch] = {
          hex: sw.getHex(),
          rgb: _.map(sw.getRgb(), c => Math.round(c)),
          title: sw.getTitleTextColor(),
          body: sw.getBodyTextColor()
        };
      }
    }
    return callback(ret);
  });
};

//# Apply swatches to a header (Vibrant.js)
helpers.ui.applyHeaderSwatch = function(swatches) {
  if ((swatches != null) && (swatches.DarkVibrant != null) && (swatches.DarkVibrant.hex != null)) {
    // Check enabled first before applying.
    if (config.get('static', 'vibrantHeaders') === true) {
      const color = swatches.DarkVibrant;
      // Header background.
      const $header = $('.details-header');
      $header.css('background-color', color.hex);
      // Fanart gradient
      const rgb = color.rgb.join(',');
      const gradient = 'linear-gradient(to right, ' + color.hex + ' 0%, rgba(' + rgb + ',0.9) 30%, rgba(' + rgb + ',0) 100%)';
      return $('.region-details-fanart .gradient', $header).css('background-image', gradient);
    }
  }
};
