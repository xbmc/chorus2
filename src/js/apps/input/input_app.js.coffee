@Kodi.module "InputApp", (InputApp, App, Backbone, Marionette, $, _) ->

  API =

    getController: ->
      App.request "command:kodi:controller", 'auto', 'Input'


  App.commands.setHandler "input:textbox", (msg) ->
    App.execute "ui:textinput:show", "Input required", msg, (text) ->
      API.getController().sendText(text)
      App.execute "notification:show", t.gettext('Sent text') + ' "' + text + '" ' + t.gettext('to Kodi')

    App.commands.setHandler "input:textbox:close", ->
      App.execute "ui:modal:close"