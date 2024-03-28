@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  API =

    # V2 of API
    baseURL: 'http://musicbrainz.org/ws/2/'

    # Max count
    maxCount: 1

    ## Make a call to API
    call: (path, params, callback) ->
      url = @baseURL + path + helpers.url.buildParams(params) + '&fmt=json'
      $.getJSON url, (resp) ->
        callback(resp)

    ## Find an artist, key is the search key, eg 'artist' or 'mbid'. id is the search query eg artist name or mbid.
    findArtist: (key, id, callback) ->
      @call 'artist/', {query: key + ':' + id}, (resp) ->
        collection = new Entities.ExternalCollection API.parseArtist(resp)
        callback collection

    ## Parse artist xml response
    parseArtist: (resp) ->
      items = []
      if resp.artists and resp.artists.length
        items = resp.artists
        items = _.map items, (item) ->
          item.artistType = item.type
          item.title = item.name
          item.type = 'artist'
          item.provider = 'musicbrainz'
          item
      items


  ## Return the first matching entity on a name lookup
  App.commands.setHandler "musicbrainz:artist:entity", (name, callback) ->
    API.findArtist 'artist', name, (collection) ->
      callback collection.first()
