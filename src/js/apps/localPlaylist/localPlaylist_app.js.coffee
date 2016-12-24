@Kodi.module "localPlaylistApp", (localPlaylistApp, App, Backbone, Marionette, $, _) ->

  class localPlaylistApp.Router extends App.Router.Base
    appRoutes:
      "playlists"       : "list"
      "playlist/:id"   : "list"


  ###
    Main functionality.
  ###

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
        App.execute "ui:modal:show", t.gettext('Add to playlist'), $content, $new
        App.listenTo view, 'childview:item:selected', (list, item) =>
          @addToExistingList item.model.get('id'), entityType, id

    ## Add to a known playlist
    addToExistingList: (playlistId, entityType, ids) ->
      ## Normalise ids is always an array but accepts a single id too
      if not _.isArray(ids)
        ids = [ids]
      if helpers.global.inArray(entityType, ['albumid', 'artistid', 'songid'])
        # Get a custom collection of songs based on type and ids
        App.request "song:custom:entities", entityType, ids, (collection) =>
          @addCollectionToList collection, playlistId
      else if entityType is 'playlist'
        ## Save current audio playlist
        collection = App.request "playlist:kodi:entities", 'audio'
        App.execute "when:entity:fetched", collection, =>
          @addCollectionToList collection, playlistId
      else
        ## TODO: movie/episode.

    ## Add the collection to the list
    addCollectionToList: (collection, playlistId, notify = true) ->
      App.request "localplaylist:item:add:entities", playlistId, collection
      App.execute "ui:modal:close"
      if notify is true
        App.execute "notification:show", t.gettext("Added to your playlist")

    ## Create a new list
    createNewList: (entityType, id) ->
      App.execute "ui:textinput:show", t.gettext('Add a new playlist'), t.gettext('Give your playlist a name'), (text) =>
        if text isnt ''
          playlistId = App.request "localplaylist:add:entity", text, 'song'
          @addToExistingList playlistId, entityType, id
      , false

    ## Create a new empty list.
    createEmptyList: ->
      App.execute "ui:textinput:show", t.gettext('Add a new playlist'), t.gettext('Give your playlist a name'), (text) =>
        if text isnt ''
          playlistId = App.request "localplaylist:add:entity", text, 'song'
          App.navigate "playlist/#{playlistId}", {trigger: true}


  ###
    Listeners.
  ###

  App.commands.setHandler "localplaylist:addentity", (entityType, id) ->
    API.addToList(entityType, id)

  App.commands.setHandler "localplaylist:newlist", ->
    API.createEmptyList()

  App.commands.setHandler "localplaylist:reload", (id) ->
    API.list(id)


  ###
    Init the router
  ###

  App.on "before:start", ->
    new localPlaylistApp.Router
      controller: API
