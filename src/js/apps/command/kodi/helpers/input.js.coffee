@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->


  ## Input commander
  class Api.Input extends Api.Commander

    commandNameSpace: 'Input'

    initKeyBind: ->
      $(document).keydown (e) =>
        @keyBind e

    ## Send a text string
    sendText: (text, callback) ->
      @singleCommand @getCommand('SendText'), [text], (resp) =>
        @doCallback callback, resp

    ## Set a single input
    sendInput: (type) ->
      @singleCommand @getCommand('type'), [], (resp) =>
        @doCallback callback, resp
        if not App.request 'sockets:active'
          App.request 'state:kodi:update', callback

    ## Send a player command.
    doKodiCommand: (command, params, callback) ->
      App.request 'command:kodi:player', command, params, =>
        @pollingUpdate(callback)

    ## Get the Kodi application controller
    getAppController: ->
      App.request "command:kodi:controller", 'auto', 'Application'

    ## Wrapper for requesting a state update if no sockets
    pollingUpdate: (callback) ->
      if not App.request 'sockets:active'
        App.request 'state:kodi:update', callback


    keyBind: (e) ->

      ## Dont do anything if foms in use
      if $(e.target).is("input, textarea")
        return

      ## Get stateObj - consider changing this to be current and work with local too?
      stateObj = App.request "state:kodi"

      ## Respond to key code
      switch e.which
        when 37 # left
          @sendInput "Left"
        when 38 # up
          @sendInput "Up"
        when 39 # right
          @sendInput "Right"
        when 40 # down
          @sendInput "Down"
        when 8 # backspace
          @sendInput "Back"
        when 13 # enter
          @sendInput "Select"
        when 67 # c (context)
          @sendInput "ContextMenu"
        when 107 # + (vol up)
          vol = stateObj.getState('volume') + 5
          @getAppControlle().setVolume ((if vol > 100 then 100 else Math.ceil(vol)))
        when 109 # - (vol down)
          vol = stateObj.getState('volume') - 5
          @getAppControlle().setVolume ((if vol < 0 then 0 else Math.ceil(vol)))
        when 32 # spacebar (play/pause)
          @doKodiCommand "PlayPause", "toggle"
        when 88 # x (stop)
          @doKodiCommand "Stop"
        when 84 # t (toggle subtitles)
          ## TODO: Add this.
        when 190 # > (next)
          @doKodiCommand "GoTo", "next"
        when 188 # < (prev)
          @doKodiCommand "GoTo", "previous"
        else # return everything else here