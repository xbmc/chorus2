@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  API =

    # Using the Kodi API key
    apiKey: 'ZWQ0Yjc4NGY5NzIyNzM1OGIzMWNhNGRkOTY2YTA0ZjE='

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
        api_key: config.getAPIKey('apiKeyFanartTv', @apiKey)
      params = _.extend defaultParams, params
      url = @baseURL + path + helpers.url.buildParams(params)
      req = $.getJSON url, (resp) ->
        callback(resp)
      req.fail (err) ->
        callback {status: 'error'}

    ## Add original and thumb properties to an image collection
    parseImageUrls: (artType, collection) ->
      if collection.status and collection.status is 'error'
        return []
      items = []
      artTypes = @[artType + 'FieldTranslate']
      for type, field of artTypes
        if collection[type]?
          collection[type] = collection[type].slice(0, @maxImageCount)
          for i, item of collection[type]
            row = item
            row.thumbnail = @getThumbnailUrl(item.url)
            row.provider = 'fanarttv'
            row.type = field
            items.push row
      items

    ## Note - this might break in the future, API does not provide a thumb
    getThumbnailUrl: (url) =>
      url.replace 'assets.fanart.tv/', 'fanart.tv/detailpreview/'

    ## Get Images
    images: (type, id, callback) ->
      @call type + '/' + id, {}, (resp) =>
        callback @parseImageUrls('artist', resp)

    ## Return a collection for an music search
    getMusicArtCollection: (name, callback) ->
      cacheKey = 'fanarttv:' + encodeURIComponent(name)
      cache = config.getLocal cacheKey, []
      if cache.length > 0
        API.createCollection cache, callback
      else
        App.execute "musicbrainz:artist:entity", name, (model) ->
          if model.get('id')
            API.images 'music', model.get('id'), (results) ->
              API.createCollection results, callback
          else
            API.createCollection [], callback

    ## Create a collection from raw items
    createCollection: (items, callback) ->
      callback(new Entities.ExternalCollection(items))


  ## Return the first matching entity on a name lookup
  App.commands.setHandler "fanarttv:artist:image:entities", (name, callback) ->
    API.getMusicArtCollection name, callback
