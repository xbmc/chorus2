@Kodi.module "AlbumApp", (AlbumApp, App, Backbone, Marionette, $, _) ->

  class AlbumApp.Router extends App.Router.Base
    appRoutes:
      "music/albums"      : "list"
      "music/album/:id"   : "view"

  API =

    list: ->
      new AlbumApp.List.Controller()

    view: (id) ->
      new AlbumApp.Show.Controller
        id: id

    action: (op, model) ->
      playlist = App.request "command:kodi:controller", 'audio', 'PlayList'
      switch op
        when 'play'
          playlist.play 'albumid', model.get('albumid')
        when 'add'
          playlist.add 'albumid', model.get('albumid')
        when 'localadd'
          App.execute "playlistlocal:additems", 'albumid', model.get('albumid')
        else
        ## nothing


  App.on "before:start", ->
    new AlbumApp.Router
      controller: API

  App.commands.setHandler 'album:action', (op, model) ->
    API.action op, model