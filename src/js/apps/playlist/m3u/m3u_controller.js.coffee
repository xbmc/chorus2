@Kodi.module "PlaylistApp.M3u", (M3u, App, Backbone, Marionette, $, _) ->

  class M3u.Controller extends App.Controllers.Base

    initialize: (options) ->
      List = @getList options.collection
      App.regionOffscreen.show List

    ## Get the list
    getList: (collection) ->
      new M3u.List
        collection: collection
