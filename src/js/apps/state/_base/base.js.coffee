@Kodi.module "StateApp", (StateApp, App, Backbone, Marionette, $, _) ->

  ## This outlines the common structure and helpers to be shared
  ## between the Kodi and local player states.
  class StateApp.Base extends Marionette.Object

    instanceSettings: {}

    state:
      player: 'kodi'
      media: 'audio'
      volume: 50
      lastVolume: 50 ## used for toggling mute
      muted: false
      shuffled: false
      repeat: 'off' # 'off'/'one'/'all'
      version: {major: 15, minor: 0}

    playing:
      playing: false # false = stopped, true = playing or paused
      paused: false
      playState: '' # playing or paused
      item: {}
      media: 'audio'
      itemChanged: false # if the item has changed since last check
      latPlaying: '' # What was playing last time we checked
      canrepeat: true
      canseek: true
      canshuffle: true
      partymode: false
      percentage: 0
      playlistid: 0
      position: 0
      speed: 0 # 1 is playing, 0 is paused
      time:
        hours: 0
        milliseconds: 0
        minutes: 0
        seconds: 0
      totaltime:
        hours: 0
        milliseconds: 0
        minutes: 0
        seconds: 0

    defaultPlayingItem:
      thumbnail: ''
      fanart: ''
      id: 0
      songid: 0
      episodeid: 0
      album: ''
      albumid: ''
      duration: 0
      type: 'song'

    getState: (key = 'all') ->
      if key is 'all'
        @state
      else
        @state[key]

    setState: (key, value) ->
      @state[key] = value

    getPlaying: (key = 'all') ->
      ret = @playing
      if ret.item.length is 0
        ret.item = @defaultPlayingItem
      if key is 'all'
        @playing
      else
        @playing[key]

    setPlaying: (key, value) ->
      @playing[key] = value

    isPlaying: ->
      @getPlaying('playing')

    isPlayingItemChanged: ->
      @getPlaying('itemChanged')

    doCallback: (callback, resp) ->
      if typeof callback is 'function'
        callback(resp)

    getCurrentState: (callback) ->
      ## Override in extending module

    getCachedState: ->
      {state: @state, playing: @playing}

    setPlayer: (player = 'kodi') ->
      $body = App.getRegion('root').$el
      $body.removeClassStartsWith('active-player-').addClass('active-player-' + player);
      config.set 'state', 'lastplayer', player

    getPlayer: ->
      player = 'kodi'
      $body = App.getRegion('root').$el
      if $body.hasClass('active-player-local')
        player = 'local'
      player