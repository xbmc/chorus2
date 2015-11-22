@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormItem extends Entities.Model
    defaults:
      id: 0
      title: ''
      type: ''
      element: ''
      options: []
      defaultValue: ''
      description: ''
      children: []
      attributes: {}

  class Entities.Form extends Entities.Collection
    model: Entities.FormItem


  API =

    applyState: (item, formState) ->
      if formState[item.id]?
        item.defaultValue = formState[item.id]
        item.defaultsApplied = true
      item

    processItems: (items, formState = {}, isChild = false) ->
      collection = []
      for item in items
        item = @applyState(item, formState)
        if item.children and item.children.length > 0
          item.children = API.processItems(item.children, formState, true)
        collection.push item
      collection

    toCollection: (items) ->
      for i, item of items
        if item.children and item.children.length > 0
          childCollection = new Entities.Form item.children
          items[i].children = childCollection
      new Entities.Form items


  ## Return a collection of form items parsed with the form state
  App.reqres.setHandler "form:item:entities", (form = [], formState = {}) ->
    API.toCollection API.processItems(form, formState)
