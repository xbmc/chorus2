@Kodi.module "Images", (Images, App, Backbone, Marionette, $, _) ->

  API =

    defaultFanartPath: 'dist/images/fanart_default/'

    defaultFanartFiles: [
      'wallpaper-443657.jpg'
      'wallpaper-45040.jpg'
      'wallpaper-765190.jpg'
      'wallpaper-84050.jpg'
    ]

    getRandomFanart: ->
      rand = helpers.global.getRandomInt(0, API.defaultFanartFiles.length - 1)
      file = API.defaultFanartFiles[rand]
      path = API.defaultFanartPath + file
      path

    setFanartBackground: (path, region) ->
      $body = App.getRegion(region).$el
      $body.css('background-image', 'url(' +  path + ')')

    getImageUrl: (rawPath, type = 'default') ->
      if not rawPath? or rawPath is ''
        path = API.getRandomFanart()
      else
        path = 'image/' + encodeURIComponent(rawPath)
      path


  App.commands.setHandler "images:fanart:set", (rawPath, region = 'regionFanart') ->
    path = API.getImageUrl(rawPath)
    API.setFanartBackground path, region