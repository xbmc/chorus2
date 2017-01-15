@Kodi.module "EPGApp", (EPGApp, App, Backbone, Marionette, $, _) ->

  class EPGApp.Router extends App.Router.Base
    appRoutes:
      "pvr/tv/:channelid"       : "tv"
      "pvr/radio/:channelid"    : "radio"

  API =

    tv: (channelid) ->
      new EPGApp.List.Controller
        channelid: channelid
        type: "tv"

    radio: (channelid) ->
      new EPGApp.List.Controller
        channelid: channelid
        type: "radio"

    action: (op, view) ->
      model = view.model
      player = App.request "command:kodi:controller", 'auto', 'Player'
      pvr = App.request "command:kodi:controller", 'auto', 'PVR'
      switch op
        when 'play'
          player.playEntity 'channelid', model.get('channelid')
        when 'record'
          pvr.setRecord model.get('channelid'), {}, ->
            App.execute "notification:show", tr("Channel recording toggled")
        when 'timer'
          pvr.toggleTimer model.get('id')
        else
          # nothing

  ## This is shared with a channel action (sidebar)
  App.commands.setHandler 'broadcast:action', (op, view) ->
    API.action op, view

  App.on "before:start", ->
    new EPGApp.Router
      controller: API
