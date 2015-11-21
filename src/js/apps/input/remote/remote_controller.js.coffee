@Kodi.module "InputApp.Remote", (Remote, App, Backbone, Marionette, $, _) ->

  class Remote.Controller extends App.Controllers.Base

    initialize: ->
      ## Watch the shell and render when ready.
      App.vent.on "shell:ready", (options) =>
        @getRemote()

    getRemote: ->
      view = new Remote.Control()
      @listenTo view, "remote:input", (type) ->
        App.execute "input:send", type
      @listenTo view, "remote:player", (type) ->
        App.request 'command:kodi:player', type, []
      @listenTo view, "remote:info", ->
        # If playing show osd
        if App.request("state:kodi").isPlaying()
          App.execute 'input:action', 'osd'
        else
          App.execute "input:send", 'Info'
      @listenTo view, "remote:power", ->
        ## TODO: Add a shutdown menu.
        appController = App.request "command:kodi:controller", 'auto', 'Application'
        appController.quit()
      App.regionRemote.show view

      ## Change the famart when the state changes.
      App.vent.on "state:changed", (state) ->
        stateObj = App.request "state:current"
        if stateObj.isPlayingItemChanged()
          playingItem = stateObj.getPlaying 'item'
          fanart = App.request "images:path:get", playingItem.fanart, 'fanart'
          $('#remote-background').css('background-image', 'url(' + playingItem.fanart + ')')