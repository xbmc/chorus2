@Kodi.module "PlaylistApp.LocalParty", (LocalParty, App, Backbone, Marionette, $, _) ->

  API =

    getController: () ->
      new LocalParty.Manager()

  ## Local playlist Partymode.
  class LocalParty.Manager extends App.Controllers.Base

    ## Init
    initialize: (options) ->
      @stateObj = App.request "state:local"
      @localPlaylist = App.request "command:local:controller", 'audio', 'PlayList'

    ## Get the list
    fillGlasses: (callback) ->
      # Set state to partymode.
      @stateObj.setPlaying('partymode', true)
      # Get 10 songs
      @getSongs 10, (collection) =>
        ## Clear playlist
        @localPlaylist.clear () =>
          ## Add songs to playlist and play
          @localPlaylist.playCollection collection
          if callback
            callback true

    ## Add one more song and remove first song
    topUpGlasses: () ->
      # Get new last song
      @getSongs 1, (collection) =>
        # Remove first song
        @localPlaylist.remove 0, () =>
          # Add new last song
          @localPlaylist.addCollection collection

    ## Get the songs to play
    getSongs: (limit, callback) ->
      options =
        sort: {method: 'random', order: 'ascending'}
        limit: {start: 0, end: limit}
        cache: false
        success: (result) ->
          callback result
      App.request "song:entities", options

    ## Disable party mode.
    leaveParty: (callback) ->
      @stateObj.setPlaying('partymode', false)
      if callback
        callback true

    ## Is party mode active
    isPartyMode: () ->
      @stateObj.getPlaying('partymode', false)


  ## Enable, disable or toggle party mode
  App.commands.setHandler 'playlist:local:partymode', (op = 'toggle', callback) ->
    manager = API.getController()
    if op is 'toggle'
      op = !manager.isPartyMode()
    if op is true
      manager.fillGlasses(callback)
    else
      manager.leaveParty(callback)
    App.vent.trigger "state:local:changed"

  ## Listen to local song finished
  App.vent.on "state:local:next", () ->
    manager = API.getController()
    if manager.isPartyMode()
      manager.topUpGlasses()
