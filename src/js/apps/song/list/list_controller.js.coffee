@Kodi.module "SongApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    getSongsView: (songs) ->
      new List.Songs
        collection: songs


  App.reqres.setHandler "song:list:view", (songs) ->
    API.getSongsView songs