###
  Youtube collection
###
@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  API =

    apiKey: 'AIzaSyBxvaR6mCnUWN8cv2TiPRmuEh0FykBTAH0'
    searchUrl: 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDefinition=any&videoEmbeddable=true&order=relevance&safeSearch=none'
    maxResults: 5

    getSearchUrl: ->
      @searchUrl + '&key=' + @apiKey

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
          url: 'https://youtu.be/' + item.id.videoId
          addonEnabled: enabled
        items.push resp
      items


  class Entities.youtubeItem extends Entities.Model
    defaults:
      id: ''
      title: ''
      desc: ''
      thumbnail: ''

  class Entities.youtubeCollection extends Entities.Collection
    model: Entities.youtubeItem
    url: API.getSearchUrl()
    sync: (method, collection, options) ->
      options.dataType = "jsonp"
      options.timeout = 5000
      Backbone.sync(method, collection, options);
    parse: (resp) ->
      API.parseItems resp


  App.commands.setHandler "youtube:search:entities", (query, options = {}, callback) ->
    yt = new Entities.youtubeCollection()
    data = _.extend {q: query, maxResults: API.maxResults}, options
    yt.fetch({
      data: data
      success: (collection) ->
        callback collection
      error: (collection) ->
        helpers.debug.log 'Youtube search error', 'error', collection
    })
