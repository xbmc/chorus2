@Kodi.module "InputApp", (InputApp, App, Backbone, Marionette, $, _) ->

  API =
 
    initKeyBind: ->
      $(document).keydown (e) =>
        @keyBind e

    ## The input controller
    inputController: ->
      App.request "command:kodi:controller", 'auto', 'Input'

    ## Send a player command.
    doCommand: (command, params, callback) ->
      App.request 'command:kodi:player', command, params, =>
        @pollingUpdate(callback)

    ## Get the Kodi application controller
    appController: ->
      App.request "command:kodi:controller", 'auto', 'Application'

    ## Wrapper for requesting a state update if no sockets
    pollingUpdate: (callback) ->
      if not App.request 'sockets:active'
        App.request 'state:kodi:update', callback

    ## The input binds
    keyBind: (e) ->

      ## Dont do anything if foms in use
      if $(e.target).is("input, textarea")
        return

      ## Get stateObj - consider changing this to be current and work with local too?
      stateObj = App.request "state:kodi"

      ## Respond to key code
      switch e.which
        when 37 # left
          @inputController().sendInput "Left"
        when 38 # up
          @inputController().sendInput "Up"
        when 39 # right
          @inputController().sendInput "Right"
        when 40 # down
          @inputController().sendInput "Down"
        when 8 # backspace
          @inputController().sendInput "Back"
        when 13 # enter
          @inputController().sendInput "Select"
        when 67 # c (context)
          @inputController().sendInput "ContextMenu"
        when 107 # + (vol up)
          vol = stateObj.getState('volume') + 5
          @appController().setVolume ((if vol > 100 then 100 else Math.ceil(vol)))
        when 109 # - (vol down)
          vol = stateObj.getState('volume') - 5
          @appController().setVolume ((if vol < 0 then 0 else Math.ceil(vol)))
        when 32 # spacebar (play/pause)
          @doCommand "PlayPause", "toggle"
        when 88 # x (stop)
          @doCommand "Stop"
        # when 84 # t (toggle subtitles)
          ## TODO
        when 190 # > (next)
          @doCommand "GoTo", "next"
        when 188 # < (prev)
          @doCommand "GoTo", "previous"
        else # return everything else here


  App.commands.setHandler "input:textbox", (msg) ->
    App.execute "ui:textinput:show", "Input required", msg, (text) ->
      API.inputController().sendText(text)
      App.execute "notification:show", t.gettext('Sent text') + ' "' + text + '" ' + t.gettext('to Kodi')

    App.commands.setHandler "input:textbox:close", ->
      App.execute "ui:modal:close"



  ## Startup tasks.
  App.addInitializer ->
    ## Bind to the keyboard inputs
    API.initKeyBind()