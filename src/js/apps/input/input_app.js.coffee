@Kodi.module "InputApp", (InputApp, App, Backbone, Marionette, $, _) ->


  App.commands.setHandler "input:textbox", (msg) ->
    App.trigger "ui:textinput:show", "Input required", msg, (text) ->
      ## Send 'text' to Kodi
