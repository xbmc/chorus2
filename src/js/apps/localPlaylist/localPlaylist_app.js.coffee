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

    ## Wrapper for adding to a new or existing list.
    addToList: (entityType, id) ->
      playlists = App.request "localplaylist:entities"
      if not playlists or playlists.length is 0
        @createNewList(entityType, id)
      else
        view = new localPlaylistApp.List.SelectionList
          collection: playlists
        $content = view.render().$el
        ## New list button
        $new = $('<button>').html( t.gettext('Create a new list') ).addClass('btn btn-primary')
        $new.on 'click', =>
          _.defer ->
            API.createNewList(entityType, id)
        ## Show the list of playlists.
        App.execute "ui:modal:show", 'Select a playlist', $content, $new
        App.listenTo view, 'childview:item:selected', (list, item) =>
          console.log "existing list"
          @addToExistingList item.model.get('id'), entityType, id

    ## Add to a known playlist
    addToExistingList: (playlistId, entityType, id) ->
      if helpers.global.inArray(entityType, ['albumid', 'artistid', 'songid'])
        collection = App.request "song:filtered:entities", {filter: helpers.global.paramObj(entityType, id)}
        App.execute "when:entity:fetched", collection, =>
          App.request "localplaylist:item:add:entities", playlistId, collection
          App.execute "ui:modal:close"
          App.execute "notification:show", t.gettext("Added to your playlist")
      else
        ## TODO: movie/episode.

    ## Create a new list
    createNewList: (entityType, id) ->
      App.execute "ui:textinput:show", 'Add a new playlist', 'Give your playlist a name', (text) =>
        if text isnt ''
          playlistId = App.request "localplaylist:add:entity", text, 'song'
          @addToExistingList playlistId, entityType, id
      , false

    createEmptyList: ->
      console.log 'asdffasf'
      App.execute "ui:textinput:show", 'Add a new playlist', 'Give your playlist a name', (text) =>
        if text isnt ''
          playlistId = App.request "localplaylist:add:entity", text, 'song'
          App.navigate "playlist/#{playlistId}", {trigger: true}

  App.on "before:start", ->
    new localPlaylistApp.Router
      controller: API


  App.commands.setHandler "playlistlocal:additems", (entityType, id) ->
    API.addToList(entityType, id)

  App.commands.setHandler "playlistlocal:newlist", ->
    API.createEmptyList()

  App.commands.setHandler "playlistlocal:reload", (id) ->
    API.list(id)

