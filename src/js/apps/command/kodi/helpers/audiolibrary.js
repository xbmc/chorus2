@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## Audio Library
  class Api.AudioLibrary extends Api.Commander

    commandNameSpace: 'AudioLibrary'

    ## Set a album value
    setAlbumDetails: (id, fields = {}, callback) ->
      params = {albumid: id}
      params = _.extend params, fields
      @singleCommand @getCommand('SetAlbumDetails'), params, (resp) =>
        @doCallback callback, resp

    ## Set a artist value
    setArtistDetails: (id, fields = {}, callback) ->
      params = {artistid: id}
      params = _.extend params, fields
      @singleCommand @getCommand('SetArtistDetails'), params, (resp) =>
        @doCallback callback, resp

    ## Set a song value
    setSongDetails: (id, fields = {}, callback) ->
      params = {songid: id}
      params = _.extend params, fields
      @singleCommand @getCommand('SetSongDetails'), params, (resp) =>
        @doCallback callback, resp

    ## Scan library
    scan: (callback) ->
      @singleCommand @getCommand('Scan'), (resp) =>
        @doCallback callback, resp

    ## Clean library
    clean: (callback) ->
      @singleCommand @getCommand('Clean'), {showdialogs: false}, (resp) =>
        @doCallback callback, resp
