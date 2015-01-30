@Kodi.module "Fanart", (Shell, App, Backbone, Marionette, $, _) ->

  API =

    defaultsPath: 'dist/images/fanart_default/'

    defaultFiles: [
      'wallpaper-443657.jpg'
      'wallpaper-45040.jpg'
      'wallpaper-765190.jpg'
      'wallpaper-84050.jpg'
    ]

    getRandomFanart: ->
      rand = helpers.global.getRandomInt(0, API.defaultFiles.length)
      file = API.defaultFiles[rand]
      API.defaultsPath + file

    setBackground: (path) ->
      $body = App.getRegion(region).$el
      $body.css('background-image', path)


