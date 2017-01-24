@Kodi.module "ExternalApp.FanartTV", (Provider, App, Backbone, Marionette, $, _) ->


  API =

    getController: () ->
      new Provider.Controller()


  class Provider.Controller extends App.Controllers.Base

      # Using the Kodi API key
      apiKey: 'ed4b784f97227358b31ca4dd966a04f1'

      # V3 of API
      baseURL: 'http://webservice.fanart.tv/v3/'

      # Max image count
      maxImageCount: 15

      artistFieldTranslate:
        artistbackground: 'fanart'
        artistthumb: 'thumbnail'

      ## Make a call to API
      call: (path, params, callback) ->
        defaultParams =
          api_key: @apiKey
        params = _.extend defaultParams, params
        url = @baseURL + path + helpers.url.buildParams(params)
        req = $.getJSON url, (resp) ->
          callback(resp)
        req.fail (err) ->
          callback {status: 'error'}

      ## Add original and thumb properties to an image collection
      parseImageUrls: (artType, collection) ->
        if collection.status and collection.status is 'error'
          return false
        ret = {}
        artTypes = @[artType + 'FieldTranslate']
        for type, field of artTypes
          ret[field] = []
          collection[type] = collection[type].slice(0, @maxImageCount)
          for i, item of collection[type]
            row = item
            row.original = item.url
            row.thumb = item.url
            ret[field].push row
        ret

      ## Get Images
      images: (type, id, callback) ->
        @call type + '/' + id, {}, (resp) =>
          console.log resp
          callback @parseImageUrls('artist', resp)



  ## Find artist images via name
  App.commands.setHandler "fanarttv:artist:images", (name, callback) ->
    App.execute "musicbrainz:artist:id", name, (id) ->
      if id isnt false
        controller = API.getController()
        controller.images 'music', id, callback
      else
        callback(false)
