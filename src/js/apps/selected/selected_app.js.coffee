@Kodi.module "Selected", (Selected, App, Backbone, Marionette, $, _) ->

  ## The Selected.List object handles what is currently selected and
  ## methods relating to selected actions.
  class Selected.List extends Marionette.Object

    items: []
    media: ''
    type: ''

    # Get raw items
    getItems: ->
      @items

    # Get all playable items as a collection
    getCollection: (callback) ->
      # Music
      if helpers.global.inArray(@type, ['song', 'artist', 'album'])
        ids = _.pluck @items, 'id'
        idProp = @type + 'id'
        App.request "song:custom:entities", idProp, ids, (collection) ->
          callback collection
      else
        # Video
        collection = App.request @type + ":build:collection", @items
        callback collection

    # Add or remove a model from items
    updateItems: (op, model) ->
      # Remove from items first
      @items = _.filter @items, (item) ->
        item.uid != model.uid
      if op is 'add'
        @items.push model
        @type = model.type
        @media = if helpers.global.inArray(@type, ['song', 'album', 'artist']) then 'audio' else 'video'
      @updateUi()
      @

    # Clear all items in the list
    clearItems: ->
      @items = []
      @updateUi()
      @

    setMedia: (media) ->
      @media = media
      @

    getType: ->
      @type

    getMedia: ->
      @media

    # Update the count in the selected action area, toggle visibility and and media class
    updateUi: ->
      selectedText = @items.length + ' ' + t.ngettext("item selected", "items selected", @items.length)
      $('#selected-count').text(selectedText)
      $selectedRegion = $('#selected-region');
      $selectedRegion.removeClassStartsWith('media-');
      $selectedRegion.addClass('media-' + @media)
      if @items.length is 0
        $selectedRegion.hide()
        $('.selected').removeClass('selected')
      else
        $selectedRegion.show()


  # Add an instance of the selected object to the app
  App.addInitializer ->
    App.selected = new Selected.List


  ## Handler to get items
  App.reqres.setHandler "selected:get:items", () ->
    App.selected.getItems()

  ## Handler to get media
  App.reqres.setHandler "selected:get:media", () ->
    App.selected.getMedia()

  ## Handler to update items
  App.commands.setHandler "selected:update:items", (op, model) ->
    App.selected.updateItems op, model

  ## Handler to clear items
  App.commands.setHandler "selected:clear:items", () ->
    App.selected.clearItems()

  ## Handler to clear items
  App.commands.setHandler "selected:set:media", (media) ->
    App.selected.setMedia media

  ## Handler to Kodi play
  App.commands.setHandler "selected:action:play", () ->
    App.selected.getCollection (collection) ->
      kodiPlaylist = App.request "command:kodi:controller", App.selected.getMedia(), 'PlayList'
      kodiPlaylist.playCollection collection
      App.selected.clearItems()

  ## Handler to Kodi add
  App.commands.setHandler "selected:action:add", () ->
    App.selected.getCollection (collection) ->
      kodiPlaylist = App.request "command:kodi:controller", App.selected.getMedia(), 'PlayList'
      kodiPlaylist.addCollection collection
      App.selected.clearItems()

  ## Handler to local add
  App.commands.setHandler "selected:action:localadd", () ->
    items = App.selected.getItems()
    ids = _.pluck items, 'id'
    idProp = App.selected.getType() + 'id'
    App.execute "localplaylist:addentity", idProp, ids
    App.selected.clearItems()