@Kodi.module "PVR", (PVR, App, Backbone, Marionette, $, _) ->

  class PVR.Router extends App.Router.Base
    appRoutes:
      "pvr/tv"          : "tv"
      "pvr/radio"       : "radio"
      "pvr/recordings"  : "recordings"

  API =

    tv: ->
      new PVR.ChannelList.Controller
        group: 'alltv'

    radio: ->
      new PVR.ChannelList.Controller
        group: 'allradio'

    recordings: ->
      new PVR.RecordingList.Controller()


  App.on "before:start", ->
    new PVR.Router
      controller: API

