@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->


  ## Input commander
  class Api.VideoLibrary extends Api.Commander

    commandNameSpace: 'VideoLibrary'

    ## Set a episode value
    setEpisodeDetails: (tvshowid, id, field, value, callback) ->
      params = {episodeid: id}
      params[field] = value
      @singleCommand @getCommand('SetEpisodeDetails'), [params], (resp) =>
        helpers.cache.updateCollection 'TVShowCollection', 'tvshows', tvshowid, field, value
        @doCallback callback, resp

    ## Set a movie value
    setMovieDetails: (id, field, value, callback) ->
      params = {movieid: id}
      params[field] = value
      @singleCommand @getCommand('SetMovieDetails'), params, (resp) =>
        helpers.cache.updateCollection 'MovieCollection', 'movies', id, field, value
        @doCallback callback, resp

    ## Toggle watched status
    toggleWatched: (model, callback) ->
      setPlaycount = if model.get('playcount') > 0 then 0 else 1
      if model.get('type') is 'movie'
        @setMovieDetails model.get('id'), 'playcount', setPlaycount, =>
          @doCallback callback, setPlaycount
      if model.get('type') is 'episode'
        @setEpisodeDetails model.get('id'), 'playcount', setPlaycount, =>
          @doCallback callback, setPlaycount