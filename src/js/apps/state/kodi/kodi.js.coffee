@Kodi.module "StateApp.Kodi", (StateApp, App, Backbone, Marionette, $, _) ->

  ## Kodi state object
  class StateApp.State extends App.StateApp.Base

    playerController: {}
    applicationController: {}
    playlistApi: {}

    initialize: ->
      @state = _.extend {}, @state
      @playing = _.extend {}, @playing
      @setState 'player', 'kodi'
      @playerController = App.request "command:kodi:controller", 'auto', 'Player'
      @applicationController = App.request "command:kodi:controller", 'auto', 'Application'
      @playlistApi = App.request "playlist:kodi:entity:api"
      ## Add a listener for others to trigger an update
      App.reqres.setHandler "state:kodi:update", (callback) =>
        @getCurrentState callback
      ## Add a listener for others to trigger an update
      App.reqres.setHandler "state:kodi:get", =>
        @getCachedState()

    getCurrentState: (callback) ->
      @applicationController.getProperties (properties) =>
        @setState 'volume', properties.volume
        @setState 'muted', properties.muted
        @setState 'version', properties.version
        ## Stop the timer before an update
        App.reqres.setHandler 'player:kodi:timer', 'stop'
        ## Get playing data and parse it
        @playerController.getPlaying (playing) =>
          if playing
            ## Mark basic playing info
            @setPlaying 'playing', true
            @setPlaying 'paused', (playing.properties.speed is 0)
            @setPlaying 'playState', (if playing.properties.speed is 0 then 'paused' else 'playing')
            ## Standard map
            autoMap = ['canrepeat', 'canseek', 'canshuffle', 'partymode', 'percentage', 'playlistid', 'position', 'speed', 'time', 'totaltime']
            for key in autoMap
              if playing.properties[key]?
                @setPlaying key, playing.properties[key]
            @setState 'shuffled',  playing.properties.shuffled
            @setState 'repeat',  playing.properties.repeat
            ## Media type
            media = @playerController.playerIdToName playing.properties.playlistid
            if media
              @setState 'media', media
            ## Item changed?
            if playing.item.file isnt @getPlaying('lastPlaying')
              @setPlaying 'itemChanged', true
              App.vent.trigger "state:kodi:itemchanged", @getCachedState()
            else
              @setPlaying 'itemChanged', false
            @setPlaying 'lastPlaying', playing.item.file
            ## Playing item
            @setPlaying 'item', @parseItem playing.item, {media: media, playlistid: playing.properties.playlistid}
            ## Start the timer up again
            App.reqres.setHandler 'player:kodi:timer', 'start'
          else
            ## Not playing
            @setPlaying 'playing', false
            @setPlaying 'paused', false
            @setPlaying 'item', @defaultPlayingItem
            @setPlaying 'lstPlaying', ''
          ## Tell others something might have changed in the app state
          App.vent.trigger "state:kodi:changed", @getCachedState()
          App.vent.trigger "state:changed"
          ## Return callback called with saved state
          @doCallback callback, @getCachedState()

    ## Parse a playing item fixing the url and image
    parseItem: (model, options) ->
      model = @playlistApi.parseItem model, options
      model = App.request "images:path:entity", model
      model.url = helpers.url.get model.type, model.id
      model.url = helpers.url.playlistUrl model
      model
