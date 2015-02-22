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

    action: (op, view) ->
      model = view.model
      playlist = App.request "command:kodi:controller", 'audio', 'PlayList'
      switch op
        when 'play'
          playlist.play 'albumid', model.get('albumid')
        when 'add'
          playlist.add 'albumid', model.get('albumid')
        when 'localadd'
          App.execute "localplaylist:addentity", 'albumid', model.get('albumid')
        when 'localplay'
          localPlaylist = App.request "command:local:controller", 'audio', 'PlayList'
          songs = App.request "song:filtered:entities", {filter: {albumid: model.get('albumid')}}
          App.execute "when:entity:fetched", songs, =>
            localPlaylist.play songs.getRawCollection()
        else
        ## nothing


  App.on "before:start", ->
    new AlbumApp.Router
      controller: API

  App.commands.setHandler 'album:action', (op, model) ->
    API.action op, model