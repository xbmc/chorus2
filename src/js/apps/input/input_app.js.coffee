@Kodi.module "InputApp", (InputApp, App, Backbone, Marionette, $, _) ->


  class InputApp.Router extends App.Router.Base
    appRoutes:
      "remote"        : "remotePage"


  API =

    initKeyBind: ->
      $(document).keydown (e) =>
        @keyBind e

    ## The input controller
    inputController: ->
      App.request "command:kodi:controller", 'auto', 'Input'

    ## Do an input command
    doInput: (type) ->
      @inputController().sendInput type, []

    ## Do an action
    ## http://kodi.wiki/view/JSON-RPC_API/v6#Input.Action
    doAction: (action) ->
      @inputController().sendInput 'ExecuteAction', [action]

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

    ## Toggle remote visibility and path
    toggleRemote: (open = 'auto') ->
      $body = $('body')
      rClass = 'section-remote'
      if open is 'auto'
        open = ($body.hasClass(rClass))
      if open
        window.history.back()
        helpers.backscroll.scrollToLast()
      else
        helpers.backscroll.setLast()
        App.navigate("remote", {trigger: true});

    ## Page callback, open remote and clear content.
    remotePage: ->
      @toggleRemote('auto');
      App.regionContent.empty()

    ## The input binds
    keyBind: (e) ->

      # Get settings
      kodiControl = config.getLocal('keyboardControl') is 'kodi'
      remotePage = $('body').hasClass('page-remote')

      ## Don't do anything if forms in use or if we have a local only setting
      if $(e.target).is("input, textarea, select")
        return

      ## Don't do anything for white listed commands like CTRL, ALT, SHIFT, etc
      whiteListCommands = [17, 16, 91, 18, 70]
      if helpers.global.inArray e.which, whiteListCommands
        return

      # If no Kodi control and not on the remote page
      if not kodiControl and not remotePage
        return

      # If all keyboard controls are for kodi or on the remote page
      if kodiControl or remotePage
        e.preventDefault()

      ## Get stateObj - consider changing this to be current and work with local too?
      stateObj = App.request "state:kodi"

      ## Respond to key code
      switch e.which
        when 37, 72 # left, h
          @doInput "Left"
        when 38, 75 # up, k
          @doInput "Up"
        when 39, 76 # right, l
          @doInput "Right"
        when 40, 74 # down, j
          @doInput "Down"
        when 8 # backspace
          @doInput "Back"
        when 13 # enter
          @doInput "Select"
        when 67 # c (context)
          @doInput "ContextMenu"
        when 107, 187, 61 # + (vol up)
          vol = stateObj.getState('volume') + 5
          @appController().setVolume ((if vol > 100 then 100 else Math.ceil(vol)))
        when 109, 189, 173 # - (vol down)
          vol = stateObj.getState('volume') - 5
          @appController().setVolume ((if vol < 0 then 0 else Math.ceil(vol)))
        when 77 # m (mute)
          @appController().toggleMute()
        when 32 # spacebar (play/pause)
          @doCommand "PlayPause", "toggle"
        when 88 # x (stop)
          @doCommand "Stop"
        when 84 # t (toggle subtitles)
          @doAction "showsubtitles"
        when 9 # tab (close osd)
          @doAction "close"
        when 190 # > (next)
          @doCommand "GoTo", "next"
        when 188 # < (prev)
          @doCommand "GoTo", "previous"
        when 220 # Backslash (fullscreen)
          @doAction "fullscreen"
        else # return everything else here


  App.commands.setHandler "input:textbox", (msg) ->
    App.execute "ui:textinput:show", "Input required", {msg: msg}, (text) ->
      API.inputController().sendText(text)
      App.execute "notification:show", t.gettext('Sent text') + ' "' + text + '" ' + t.gettext('to Kodi')

  App.commands.setHandler "input:textbox:close", ->
    App.execute "ui:modal:close"

  App.commands.setHandler "input:send", (action) ->
    API.doInput action

  App.commands.setHandler "input:remote:toggle", ->
    API.toggleRemote()

  App.commands.setHandler "input:action", (action) ->
    API.doAction(action)

  App.commands.setHandler "input:resume", (model, idKey) ->
    controller = new InputApp.Resume.Controller()
    controller.resumePlay model, idKey

  ## Startup tasks.
  App.addInitializer ->

    ## Render remote
    controller = new InputApp.Remote.Controller()

    ## Bind to the keyboard inputs
    API.initKeyBind()

  ## Start the router.
  App.on "before:start", ->
    new InputApp.Router
      controller: API
