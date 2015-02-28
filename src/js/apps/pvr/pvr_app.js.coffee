@Kodi.module "ChannelApp", (ChannelApp, App, Backbone, Marionette, $, _) ->

  class ChannelApp.Router extends App.Router.Base
    appRoutes:
      "tvshows/live"   : "tv"
      "music/radio"    : "radio"

  API =

    tv: ->
      new ChannelApp.List.Controller
        group: 'alltv'

    radio: ->
      new ChannelApp.List.Controller
        group: 'allradio'


  App.on "before:start", ->
    new ChannelApp.Router
      controller: API

