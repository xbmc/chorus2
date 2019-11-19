###
  Youtube collection
###
@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  API =

    apiKey: 'QUl6YVN5Qnh2YVI2bUNuVVdOOGN2MlRpUFJtdUVoMEZ5a0JUQUgw'
    searchUrl: 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDefinition=any&videoEmbeddable=true&order=relevance&safeSearch=none'
    maxResults: 5

    kodiUrl: 'plugin://plugin.video.youtube/?action=play_video&videoid='
    ytURL: 'https://youtu.be/'

    getSearchUrl: ->
      @searchUrl + '&key=' + config.getAPIKey('apiKeyYouTube', @apiKey)

    parseItems: (response) ->
      items = []
      enabled = if App.request("addon:isEnabled", {addonid: 'plugin.video.youtube'}) then true else false
      for i, item of response.items
        resp =
          id: item.id.videoId
          title: item.snippet.title
          label: item.snippet.title
          desc: item.snippet.description
          thumbnail: item.snippet.thumbnails.medium.url
          url: API.ytURL + item.id.videoId
          addonEnabled: enabled
        items.push resp
      items


  class Entities.YouTubeCollection extends Entities.ExternalCollection
    model: Entities.ExternalEntity
    url: API.getSearchUrl()
    sync: (method, collection, options) ->
      options.dataType = "jsonp"
      options.timeout = 5000
      Backbone.sync(method, collection, options);
    parse: (resp) ->
      API.parseItems resp


  App.commands.setHandler "youtube:search:entities", (query, options = {}, callback) ->
    yt = new Entities.YouTubeCollection()
    data = _.extend {q: query, maxResults: API.maxResults}, options
    yt.fetch({
      data: data
      success: (collection) ->
        callback collection
      error: (collection) ->
        helpers.debug.log 'Youtube search error', 'error', collection
    })

  App.commands.setHandler "youtube:trailer:entities", (title, callback) ->
    App.execute "youtube:search:entities", title + ' trailer', {}, (collection) ->
      collection.map (item) ->
        item.set
          type: 'trailer'
          url: API.kodiUrl + item.id
        item
      callback collection