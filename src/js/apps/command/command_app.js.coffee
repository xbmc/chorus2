@Kodi.module "Command", (Command, App, Backbone, Marionette, $, _) ->

  App.reqres.setHandler "command:kodi:player", (method, params, callback) ->
    commander = new Command.Kodi.Player()
    commander.sendCommand method, params, callback

