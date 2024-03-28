@Kodi.module "MusicVideoApp", (MusicVideoApp, App, Backbone, Marionette, $, _) ->

  class MusicVideoApp.Router extends App.Router.Base
    appRoutes:
      "music/videos"      : "list"
      "music/video/:id"   : "view"

  API =

    list: ->
      new MusicVideoApp.List.Controller()

    view: (id) ->
      new MusicVideoApp.Show.Controller
        id: id

    action: (op, view) ->
      model = view.model
      playlist = App.request "command:kodi:controller", 'video', 'PlayList'
      files = App.request "command:kodi:controller", 'video', 'Files'
      videoLib = App.request "command:kodi:controller", 'video', 'VideoLibrary'
      # Action to do
      switch op
        when 'play'
          App.execute "input:resume", model, 'musicvideoid'
        when 'add'
          playlist.add 'musicvideoid', model.get('musicvideoid')
        when 'localplay'
          files.videoStream model.get('file'), model.get('fanart')
        when 'download'
          files.downloadFile model.get('file')
        when 'refresh'
          helpers.entities.refreshEntity model, videoLib, 'refreshMusicVideo'
        else
          ## nothing


  App.on "before:start", ->
    new MusicVideoApp.Router
      controller: API

  App.commands.setHandler 'musicvideo:action', (op, model) ->
    API.action op, model

  App.reqres.setHandler 'musicvideo:action:items', ->
    {
      actions: {thumbs: tr('Thumbs up')}
      menu: {
        'add': tr('Queue in Kodi')
        'divider-1': ''
        'download': tr('Download')
        'stream': tr('Play in browser')
        'divider-2': ''
        'edit': tr('Edit')
      }
    }

  App.commands.setHandler 'musicvideo:edit', (model) ->
    loadedModel = App.request "musicvideo:entity", model.get('id')
    App.execute "when:entity:fetched", loadedModel, =>
      new MusicVideoApp.Edit.Controller
        model: loadedModel
