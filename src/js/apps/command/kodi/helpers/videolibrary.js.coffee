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

    ## Set a tvshow value
    setTVShowDetails: (id, fields = {}, callback) ->
      params = {tvshowid: id}
      params = _.extend params, fields
      @singleCommand @getCommand('SetTVShowDetails'), params, (resp) =>
        @doCallback callback, resp

    ## Scan library
    scan: (callback) ->
      @singleCommand @getCommand('Scan'), (resp) =>
        @doCallback callback, resp

    ## Clean library
    clean: (callback) ->
      @singleCommand @getCommand('Clean'), {showdialogs: false}, (resp) =>
        @doCallback callback, resp

    ## Toggle watched on a collection. op is 'watched' or 'unwatched'
    toggleWatchedCollection: (collection, op, callback) ->
      for i, model of collection.models
        @toggleWatched model, op
      @doCallback callback, true

    ## Toggle watched status. op is 'watched' or 'unwatched'
    toggleWatched: (model, op = 'auto', callback) ->
      if op is 'auto'
        setPlaycount = if model.get('playcount') > 0 then 0 else 1
      else if op is 'watched'
        setPlaycount = 1
      else if op is 'unwatched'
        setPlaycount = 0
      fields = helpers.global.paramObj 'playcount', setPlaycount
      if model.get('type') is 'movie'
        @setMovieDetails model.get('id'), fields, =>
          App.vent.trigger 'entity:kodi:update', model.get('uid')
          @doCallback callback, setPlaycount
      if model.get('type') is 'episode'
        @setEpisodeDetails model.get('id'), fields, =>
          App.vent.trigger 'entity:kodi:update', model.get('uid')
          @doCallback callback, setPlaycount

    ## Refresh a movie
    refreshMovie: (id, params, callback) ->
      params = _.extend {movieid: id, ignorenfo: false}, params
      @singleCommand @getCommand('RefreshMovie'), params, (resp) =>
        @doCallback callback, resp

    ## Refresh a tvshow
    refreshTVShow: (id, params, callback) ->
      params = _.extend {tvshowid: id, ignorenfo: false}, params
      @singleCommand @getCommand('RefreshTVShow'), params, (resp) =>
        @doCallback callback, resp

    ## Refresh an episode
    refreshEpisode: (id, params, callback) ->
      params = _.extend {episodeid: id, ignorenfo: false}, params
      @singleCommand @getCommand('RefreshEpisode'), params, (resp) =>
        @doCallback callback, resp