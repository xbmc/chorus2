@Kodi.module "ExternalApp.TheMovieDB", (Provider, App, Backbone, Marionette, $, _) ->


  API =

    getController: () ->
      new Provider.Controller()


  class Provider.Controller extends App.Controllers.Base

      # Using the Kodi API key
      apiKey: 'f7f51775877e0bb6703520952b3c7840'

      # V3 of API
      baseURL: 'https://api.themoviedb.org/3/'

      # Image base path
      baseImageURL: 'https://image.tmdb.org/t/p/'

      # Default lang
      defaultLang: 'en'

      # Max image count
      maxImageCount: 15

      # Default thumb sizes
      thumbSize:
        backdrops: 'w300'
        posters: 'w185'

      fieldTranslate:
        backdrops: 'fanart'
        posters: 'thumbnail'

      ## Make a call to API
      call: (path, params, callback) ->
        defaultParams =
          api_key: @apiKey
        params = _.extend defaultParams, params
        url = @baseURL + path + helpers.url.buildParams(params) + '&callback=?'
        $.getJSON url, (resp) ->
          callback(resp)

      ## Get an image url, Sizes are:
      ## - Backdrop: w300, w780, w1280, original
      ## - Poster: w92, w154, w185, w342, w500, w780, original
      ## - Profile: w45, w185, h632, original
      ## - Stills: w92, w185, w300, original
      ## @see https://developers.themoviedb.org/3/configuration/get-api-configuration
      getImageURL: (path, size = 'original') ->
        @baseImageURL + size + path

      ## Add original and thumb properties to an image collection
      addImageUrls: (collection) ->
        ret = {}
        types = ['backdrops', 'posters']
        for type in types
          field = @fieldTranslate[type]
          ret[field] = []
          collection[type] = collection[type].slice(0, @maxImageCount)
          for i, item of collection[type]
            row = item
            row.original = @getImageURL item.file_path, 'original'
            row.thumb = @getImageURL item.file_path, @thumbSize[type]
            ret[field].push row
        ret

      ## Find a movie
      find: (id, source = 'imdb_id', callback) ->
        @call 'find/' + id, {external_source: source}, callback

      ## Get Images
      images: (type, tmbdbId, callback) ->
        @call type + '/' + tmbdbId + '/images', {include_image_language: @defaultLang + ',null'}, (resp) =>
          callback @addImageUrls(resp)



  ## Find movie images via IMDb ID
  App.commands.setHandler "themoviedb:movie:images", (imdbId, callback) ->
    controller = API.getController()
    controller.find imdbId, 'imdb_id', (resp) ->
      if resp.movie_results and resp.movie_results.length > 0
        item = _.first resp.movie_results
        controller.images 'movie', item.id, callback
      else
        callback(false)

  ## Find tv images via IMDb ID (if starts with tt) or thetvdb ID if not.
  App.commands.setHandler "themoviedb:tv:images", (id, callback) ->
    controller = API.getController()
    idType = if id.lastIndexOf('tt', 0) is 0 then 'imdb_id' else 'tvdb_id'
    controller.find id, idType, (resp) ->
      if resp.tv_results and resp.tv_results.length > 0
        item = _.first resp.tv_results
        controller.images 'tv', item.id, callback
      else
        callback(false)