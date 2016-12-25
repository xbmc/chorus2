@Kodi.module "MovieApp", (MovieApp, App, Backbone, Marionette, $, _) ->

  class MovieApp.Router extends App.Router.Base
    appRoutes:
      "movies"   	: "list"
      "movie/:id"	: "view"

  API =

    list: ->
      new MovieApp.List.Controller()

    view: (id) ->
      new MovieApp.Show.Controller
        id: id

    action: (op, view) ->
      model = view.model
      playlist = App.request "command:kodi:controller", 'video', 'PlayList'
      files = App.request "command:kodi:controller", 'video', 'Files'
      videoLib = App.request "command:kodi:controller", 'video', 'VideoLibrary'
      switch op
        when 'play'
          App.execute "input:resume", model, 'movieid'
        when 'add'
          playlist.add 'movieid', model.get('movieid')
        when 'localplay'
          files.videoStream model.get('file'), model.get('fanart')
        when 'download'
          files.downloadFile model.get('file')
        when 'toggleWatched'
          videoLib.toggleWatched model, 'auto'
        when 'edit'
          App.execute 'movie:edit', model
        else
        ## nothing


  App.reqres.setHandler 'movie:action:items', ->
    {
      actions: {watched: tr('Watched'), thumbs: tr('Thumbs up')}
      menu: {add: tr('Queue in Kodi'), edit: tr('Edit'), divider: '', download: tr('Download'), localplay: tr('Play in browser')}
    }

  App.commands.setHandler 'movie:action', (op, view) ->
    API.action op, view

  App.commands.setHandler 'movie:action:watched', (parent, viewItem) ->
    op = if parent.$el.hasClass('is-watched') then 'unwatched' else 'watched'
    progress = if op is 'watched' then 100 else 0
    parent.$el.toggleClass('is-watched')
    helpers.entities.setProgress(parent.$el, progress)
    helpers.entities.setProgress(parent.$el.closest('.movie-show').find('.region-content-wrapper'), progress)
    API.action 'toggleWatched', viewItem

  App.commands.setHandler 'movie:edit', (model) ->
    loadedModel = App.request "movie:entity", model.get('id')
    App.execute "when:entity:fetched", loadedModel, =>
      new MovieApp.Edit.Controller
        model: loadedModel


  App.on "before:start", ->
    new MovieApp.Router
      controller: API