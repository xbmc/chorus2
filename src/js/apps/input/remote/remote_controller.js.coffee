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
      @listenTo view, "remote:power", =>
        @getShutdownMenu()
      App.regionRemote.show view

      ## Change the fanart when the state changes.
      App.vent.on "state:changed", (state) ->
        stateObj = App.request "state:current"
        if stateObj.isPlayingItemChanged()
          playingItem = stateObj.getPlaying 'item'
          fanart = App.request "images:path:get", playingItem.fanart, 'fanart'
          $('#remote-background').css('background-image', 'url(' + playingItem.fanart + ')')

    getShutdownMenu: ->
      system = App.request "command:kodi:controller", 'auto', 'System'
      system.getProperties (props) ->
        actions = []
        optionalActions = ['shutdown', 'reboot', 'suspend', 'hibernate']
        actions.push {id: 'quit', title: 'Quit Kodi'}
        for action in optionalActions
          prop = 'can' + action
          if props[prop]
            actions.push {id: action, title: action}
        # Build modal with options
        model = new Backbone.Model {id: 1, actions: actions}
        view = new Remote.System {model: model}
        $content = view.render().$el
        # Open modal and bind actions
        App.execute "ui:modal:show", tr('Shutdown menu'), $content, '', false, 'system'
        App.listenTo view, 'system:action', (action) =>
          switch action
            when 'quit'
              App.request("command:kodi:controller", 'auto', 'Application').quit()
            when 'shutdown'
              system.shutdown()
            when 'reboot'
              system.reboot()
            when 'suspend'
              system.suspend()
            when 'hibernate'
              system.hibernate()
            else
              # nothing
          App.execute "ui:modal:close"



