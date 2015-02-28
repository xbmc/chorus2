@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## Video Library
  class Api.VideoLibrary extends Api.Commander

    commandNameSpace: 'VideoLibrary'

    ## Set a episode value
    setEpisodeDetails: (id, fields = {}, callback) ->
      params = {episodeid: id}
      params = _.extend params, fields
      @singleCommand @getCommand('SetEpisodeDetails'), params, (resp) =>
        @doCallback callback, resp

    ## Set a movie value
    setMovieDetails: (id, fields = {}, callback) ->
      params = {movieid: id}
      params = _.extend params, fields
      @singleCommand @getCommand('SetMovieDetails'), params, (resp) =>
        @doCallback callback, resp

    ## Scan library
    scan: (callback) ->
      @singleCommand @getCommand('Scan'), (resp) =>
        @doCallback callback, resp

    ## Toggle watched status
    toggleWatched: (model, callback) ->
      setPlaycount = if model.get('playcount') > 0 then 0 else 1
      fields = helpers.global.paramObj 'playcount', setPlaycount
      if model.get('type') is 'movie'
        @setMovieDetails model.get('id'), fields, =>
          helpers.cache.updateCollection 'MovieCollection', 'movies', model.get('id'), 'playcount', setPlaycount
          @doCallback callback, setPlaycount
      if model.get('type') is 'episode'
        @setEpisodeDetails model.get('id'), fields, =>
          helpers.cache.updateCollection 'TVShowCollection', 'tvshows', model.get('tvshowid'), 'playcount', setPlaycount
          @doCallback callback, setPlaycount