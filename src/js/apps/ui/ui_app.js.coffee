@Kodi.module "UiApp", (UiApp, App, Backbone, Marionette, $, _) ->


  App.commands.setHandler "ui:textinput:show", (title, msg = '', callback) ->
    ## Open a text input dialog
