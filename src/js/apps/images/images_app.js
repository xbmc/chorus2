/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Images", function(Images, App, Backbone, Marionette, $, _) {

  var API = {

    imagesPath: 'images/',

    defaultFanartPath: 'fanart_default/',

    defaultFanartFiles: [
      'cans.jpg',
      'guitar.jpg',
      'speaker.jpg',
      'turntable.jpg',
      'amp.jpg',
      'concert.jpg',
      'tweeter.jpg',
    ],

    getDefaultThumbnail() {
      return API.imagesPath + 'thumbnail_default.png';
    },

    getRandomFanart() {
      const rand = helpers.global.getRandomInt(0, API.defaultFanartFiles.length - 1);
      const file = API.defaultFanartFiles[rand];
      const path = API.imagesPath + API.defaultFanartPath + file;
      return path;
    },

    parseRawPath(rawPath) {
      const path = config.getLocal('reverseProxy') ? 'image/' + encodeURIComponent(rawPath) : '/image/' + encodeURIComponent(rawPath);
      return path;
    },

    //# set background fanart, string to 'none' removes fanart
    setFanartBackground(path, region) {
      const $body = App.getRegion(region).$el;
      if (path !== 'none') {
        if (!path) {
          path = this.getRandomFanart();
        }
        return $body.css('background-image', 'url(' +  path + ')');
      } else {
        return $body.removeAttr('style');
      }
    },

    getImageUrl(rawPath, type = 'thumbnail', useFallback = true) {
      let path = '';
      if ((rawPath == null) || (rawPath === '')) {
        switch (type) {
          case 'fanart': path = API.getRandomFanart(); break;
          default: path = API.getDefaultThumbnail();
        }
      } else if (type === 'trailer') {
        path = API.getTrailerUrl(rawPath);
      } else {
        path = API.parseRawPath(rawPath);
      }
      return path;
    },

    getTrailerUrl(rawpath) {
      const trailer = helpers.url.parseTrailerUrl((rawpath));
      return trailer.img;
    }
  };

  //# Handler to set the background fanart pic.
  App.commands.setHandler("images:fanart:set", (path, region = 'regionFanart') => API.setFanartBackground(path, region));

  //# Handler to return a parsed image path.
  App.reqres.setHandler("images:path:get", (rawPath = '', type = 'thumbnail') => API.getImageUrl(rawPath, type));

  //# Handler to apply correct paths to a model, expects to be called
  //# on the model attributes, typically during a model.parse()
  return App.reqres.setHandler("images:path:entity", function(model) {
    if (model.thumbnail != null) {
      model.thumbnailOriginal = model.thumbnail;
      model.thumbnail = API.getImageUrl(model.thumbnail, 'thumbnail');
    }
    if (model.fanart != null) {
      model.fanartOriginal = model.fanart;
      model.fanart = API.getImageUrl(model.fanart, 'fanart');
    }
    if ((model.cast != null) && (model.cast.length > 0)) {
      for (var i in model.cast) {
        var person = model.cast[i];
        model.cast[i].thumbnail = API.getImageUrl(person.thumbnail, 'thumbnail');
      }
    }
    return model;
  });
});
