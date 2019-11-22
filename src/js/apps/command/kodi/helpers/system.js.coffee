@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## Application commander.
  class Api.System extends Api.Commander

    commandNameSpace: 'System'

    getProperties: (callback) ->
      properties = ["canshutdown", "cansuspend", "canhibernate", "canreboot"]
      @singleCommand @getCommand('GetProperties'), [properties], (resp) =>
        @doCallback callback, resp

    hibernate: (callback) ->
      @singleCommand @getCommand('Hibernate'), [], (resp) =>
        @doCallback callback, resp

    reboot: (callback) ->
      @singleCommand @getCommand('Reboot'), [], (resp) =>
        @doCallback callback, resp

    shutdown: (callback) ->
      @singleCommand @getCommand('Shutdown'), [], (resp) =>
        @doCallback callback, resp

    suspend: (callback) ->
      @singleCommand @getCommand('Suspend'), [], (resp) =>
        @doCallback callback, resp
