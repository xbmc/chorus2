###
  Custom saved playlists, saved in local storage
###
@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  API =

    savedFields: ['id', 'position', 'file', 'type', 'label', 'thumbnail', 'artist', 'album', 'artistid', 'artistid', 'tvshowid', 'tvshow', 'year', 'rating', 'duration', 'track']

    playlistKey: 'localplaylist:list'
    playlistItemNamespace: 'localplaylist:item:'

    getPlaylistKey: (key) ->
      @playlistItemNamespace + key

    ## Get a collection of lists
    getListCollection: (type = 'list') ->
      collection = new Entities.localPlaylistCollection()
      collection.fetch()
      collection.where {type: type}
      collection

    addList: (model) ->
      collection = @getListCollection()
      model.id = @getNextId()
      collection.create(model)
      collection

    getNextId: ->
      collection = API.getListCollection()
      items = collection.getRawCollection()
      if items.length is 0
        nextId = 1
      else
        lastItem = _.max items, (item) -> item.id
        nextId = lastItem.id + 1
      nextId

    ## Get a collection of playlist items.
    getItemCollection: (listId) ->
      collection = new Entities.localPlaylistItemCollection([], {key: listId})
      collection.fetch()
      collection

    ## Add a collection to a playlist
    addItemsToPlaylist: (playlistId, collection) ->
      items = collection.getRawCollection()
      collection = @getItemCollection playlistId
      for position, item of items
        newItem = {}
        for fieldName in @savedFields
          if item[fieldName]
            newItem[fieldName] = item[fieldName]
        newItem.position = position
        idfield = item.type + 'id'
        newItem[idfield] = item[idfield]
        collection.create(newItem)
      collection

    ## remove all items from a list
    clearPlaylist: (playlistId) ->
      collection = @getItemCollection playlistId
      for model in collection.models
        if model?
          model.destroy()
      return


  ## The a list reference
  class Entities.localPlaylist extends Entities.Model
    defaults:
      id: 0
      name: ''
      media: '' ## song / movie / artist / etc.
      type: 'list' ## list / thumbsup / local

  ## The a list reference collection
  class Entities.localPlaylistCollection extends Entities.Collection
    model: Entities.localPlaylist
    localStorage: new Backbone.LocalStorage API.playlistKey


  ## The saved list item
  class Entities.localPlaylistItem extends Entities.Model
    idAttribute: "position"
    defaults: ->
      fields = {}
      for f in API.savedFields
        fields[f] = ''
      fields

  ## The config collection
  class Entities.localPlaylistItemCollection extends Entities.Collection
    model: Entities.localPlaylistItem
    initialize: (model, options) ->
      @localStorage = new Backbone.LocalStorage API.getPlaylistKey(options.key)




  ## Handler to save a new playlist
  App.reqres.setHandler "localplaylist:add:entity", (name, media, type = 'list') ->
    API.addList {name: name, media: media, type: type}

  ## Handler to save a new playlist
  App.reqres.setHandler "localplaylist:remove:entity", (id) ->
    collection = API.getListCollection()
    model = collection.find {id: id}
    model.destroy()

  ## Handler to get saved lists
  App.reqres.setHandler "localplaylist:entities", ->
    API.getListCollection()

  ## Handler to clear all items from a list
  App.reqres.setHandler "localplaylist:clear:entities", (playlistId) ->
    API.clearPlaylist(playlistId)

  ## Handler to get a single saved list
  App.reqres.setHandler "localplaylist:entity", (id) ->
    collection = API.getListCollection()
    collection.find {id: id}

  ## Handler to get list items
  App.reqres.setHandler "localplaylist:item:entities", (key) ->
    API.getItemCollection key

  ## Handler to add items to a playlist
  App.reqres.setHandler "localplaylist:item:add:entities", (playlistId, collection) ->
    API.addItemsToPlaylist playlistId, collection