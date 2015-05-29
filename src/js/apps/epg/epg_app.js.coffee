@Kodi.module "EPGApp", (EPGApp, App, Backbone, Marionette, $, _) ->

  class EPGApp.Router extends App.Router.Base
    appRoutes:
      "tvshows/live/:channelid"   : "tv"
      "music/radio/:channelid"    : "radio"

  API =

    tv: (channelid) ->
      new EPGApp.List.Controller
        channelid: channelid
        type: "tv"

    radio: (channelid) ->
      new EPGApp.List.Controller
        channelid: channelid
        type: "radio"


  App.on "before:start", ->
    new EPGApp.Router
      controller: API
