@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  API =

    localKey: 'searchAddons'

    ## Get a collection from local storage.
    getLocalCollection: ->
      collection = new Entities.LocalSearchAddonsCollection([], {key: @localKey})
      collection.fetch()
      collection

    # Save current form to local storage collection
    saveLocal: (items) ->
      collection = @clearLocal()
      for i, item of items
        collection.create item
      collection

    ## remove all items from a list
    clearLocal: ->
      collection = @getLocalCollection()
      while model = collection.first()
        model.destroy()
      collection

  ## Model
  class Entities.SearchAddons extends App.Entities.Model
    defaults:
      id: ''
      url: ''
      title: 'Untitled'
      media: 'music'

  ## Local storage collection
  class Entities.LocalSearchAddonsCollection extends App.Entities.Collection
    model: Entities.SearchAddons
    localStorage: new Backbone.LocalStorage API.localKey

  ## Get local storage entities
  App.reqres.setHandler "searchAddons:entities", (items) ->
    API.getLocalCollection()

  ## Update local storage entities
  App.reqres.setHandler "searchAddons:update:entities", (items) ->
    API.saveLocal items

  ## Clear local storage entities
  App.reqres.setHandler "searchAddons:update:defaults", () ->
    API.clearLocal()