@Kodi.module "localPlaylistApp", (localPlaylistApp, App, Backbone, Marionette, $, _) ->

  class localPlaylistApp.Router extends App.Router.Base
    appRoutes:
      "playlists"       : "list"
      "playlist/:id"   : "list"

  API =

    ## if no id, find the first list, else id is 0
    list: (id) ->
      if id is null
        lists = App.request "localplaylist:entities"
        items = lists.getRawCollection()
        if _.isEmpty lists
          id = 0
        else
          item = _.min items, (list) -> list.id
          id = item.id
          App.navigate helpers.url.get('playlist', id)
      new localPlaylistApp.List.Controller
        id: id

    addToList: (entityType, id) ->
      playlists = App.request "localplaylist:entities"
      view = new localPlaylistApp.List.SelectionList
        collection: playlists
      $content = view.render().$el
      App.execute "ui:modal:show", 'Select a playlist', $content
      App.listenTo view, 'childview:item:selected', (list, item) ->
        playlistId = item.model.get('id')
        if helpers.global.inArray(entityType, ['albumid', 'artistid', 'songid'])
          collection = App.request "song:filtered:entities", {filter: helpers.global.paramObj(entityType, id)}
          App.execute "when:entity:fetched", collection, =>
            App.request "localplaylist:item:add:entities", playlistId, collection
            App.execute "ui:modal:close"
            App.execute "notification:show", "Added to your playlist"
        else
          ## TODO: movie/episode.



  App.on "before:start", ->
    new localPlaylistApp.Router
      controller: API


  App.commands.setHandler "playlistlocal:additems", (entityType, id) ->
    API.addToList(entityType, id)

