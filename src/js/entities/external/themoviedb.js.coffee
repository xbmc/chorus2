@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  API =

    # Using the Kodi API key
    apiKey: 'ecbc86c92da237cb9faff6d3ddc4be6d'

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

    ## Parse response into an images collection
    parseImages: (collection) ->
      items = []
      for type, field of API.fieldTranslate
        collection[type] = collection[type].slice(0, @maxImageCount)
        for i, item of collection[type]
          item.id = item.file_path
          item.url = @getImageURL item.file_path, 'original'
          item.thumbnail = @getImageURL item.file_path, @thumbSize[type]
          item.type = field
          item.provider = 'moviedb'
          items.push item
      items

    ## Find a movie
    find: (id, source = 'imdb_id', callback) ->
      @call 'find/' + id, {external_source: source}, callback

    ## Get Images
    images: (type, tmdbId, callback) ->
      @call type + '/' + tmdbId + '/images', {include_image_language: @defaultLang + ',null'}, (resp) =>
        callback @parseImages(resp)

    ## Get an image collection
    getCollection: (options, callback) ->
      opts = _.extend {lookupType: 'imdb_id', lookupId: '', type: 'movie'}, options
      cacheKey = 'moviedb:' + JSON.stringify(opts)
      cache = config.getLocal cacheKey, []
      if cache.length > 0
        API.createCollection cache, callback
      else
        API.find opts.lookupId, opts.lookupType, (resp) ->
          resKey = opts.type + '_results'
          if resp[resKey] and resp[resKey].length > 0
            item = _.first resp[resKey]
            API.images opts.type, item.id, (resp) ->
              config.setLocal cacheKey, resp
              API.createCollection resp, callback
          else
            API.createCollection [], callback

    ## Create a collection from raw items
    createCollection: (items, callback) ->
      callback(new Entities.ExternalCollection(items))



  ## Find movie images via IMDb ID
  App.commands.setHandler "themoviedb:movie:image:entities", (lookupId, callback) ->
    options = {lookupId: lookupId}
    API.getCollection options, callback

  ## Find tv images via IMDb ID
  App.commands.setHandler "themoviedb:tv:image:entities", (lookupId, callback) ->
    lookupType = if lookupId.lastIndexOf('tt', 0) is 0 then 'imdb_id' else 'tvdb_id'
    options = {lookupId: lookupId, lookupType: lookupType, type: 'tv'}
    API.getCollection options, callback
