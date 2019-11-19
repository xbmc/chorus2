@Kodi.module "Images", (Images, App, Backbone, Marionette, $, _) ->

  API =

    imagesPath: 'images/'

    defaultFanartPath: 'fanart_default/'

    defaultFanartFiles: [
      'cans.jpg'
      'guitar.jpg'
      'speaker.jpg'
      'turntable.jpg',
      'amp.jpg',
      'concert.jpg',
      'tweeter.jpg',
    ]

    getDefaultThumbnail: ->
      API.imagesPath + 'thumbnail_default.png'

    getRandomFanart: ->
      rand = helpers.global.getRandomInt(0, API.defaultFanartFiles.length - 1)
      file = API.defaultFanartFiles[rand]
      path = API.imagesPath + API.defaultFanartPath + file
      path

    parseRawPath: (rawPath) ->
      path = if config.getLocal 'reverseProxy' then 'image/' + encodeURIComponent(rawPath) else '/image/' + encodeURIComponent(rawPath)
      path

    ## set background fanart, string to 'none' removes fanart
    setFanartBackground: (path, region) ->
      $body = App.getRegion(region).$el
      if path isnt 'none'
        if not path
          path = @getRandomFanart()
        $body.css('background-image', 'url(' +  path + ')')
      else
        $body.removeAttr('style')

    getImageUrl: (rawPath, type = 'thumbnail', useFallback = true) ->
      path = ''
      if not rawPath? or rawPath is ''
        switch type
          when 'fanart' then path = API.getRandomFanart()
          else path = API.getDefaultThumbnail()
      else if type is 'trailer'
        path = API.getTrailerUrl(rawPath)
      else
        path = API.parseRawPath(rawPath)
      path

    getTrailerUrl: (rawpath) ->
      trailer = helpers.url.parseTrailerUrl (rawpath)
      trailer.img

  ## Handler to set the background fanart pic.
  App.commands.setHandler "images:fanart:set", (path, region = 'regionFanart') ->
    API.setFanartBackground path, region

  ## Handler to return a parsed image path.
  App.reqres.setHandler "images:path:get", (rawPath = '', type = 'thumbnail') ->
    API.getImageUrl(rawPath, type)

  ## Handler to apply correct paths to a model, expects to be called
  ## on the model attributes, typically during a model.parse()
  App.reqres.setHandler "images:path:entity", (model) ->
    if model.thumbnail?
      model.thumbnailOriginal = model.thumbnail
      model.thumbnail = API.getImageUrl(model.thumbnail, 'thumbnail')
    if model.fanart?
      model.fanartOriginal = model.fanart
      model.fanart = API.getImageUrl(model.fanart, 'fanart')
    if model.cast? and model.cast.length > 0
      for i, person of model.cast
        model.cast[i].thumbnail = API.getImageUrl(person.thumbnail, 'thumbnail')
    model
