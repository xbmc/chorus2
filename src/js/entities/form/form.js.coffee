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
      class: ''
      suffix: ''
      prefix: ''

  class Entities.Form extends Entities.Collection
    model: Entities.FormItem


  API =

    applyState: (item, formState) ->
      item.defaultValue = if item.defaultValue then item.defaultValue else ''
      if formState[item.id]?
        item.defaultValue = @formatDefaultValue item.format, formState[item.id]
        item.defaultsApplied = true
      item

    formatDefaultValue: (format, value) ->
      if format is 'array.string' or format is 'array.integer'
        value.join('; ')
      else if format is 'integer' and value isnt ''
        parseInt value
      else
        value

    formatSubmittedValues: (item, values) ->
      if item.format and values[item.id]?
        if item.format is 'array.string'
          values[item.id] = if values[item.id] isnt '' then _.map values[item.id].split(';'), (v) -> v.trim() else []
        else if item.format is 'array.integer'
          values[item.id] = if values[item.id] isnt '' then _.map values[item.id].split(';'), (v) -> parseInt(v.trim()) else []
        else if item.format is 'integer'
          values[item.id] = parseInt values[item.id]
        else if item.format is 'float'
          values[item.id] = parseFloat values[item.id]
        else if item.format is 'prevent.submit'
          delete values[item.id]
      values

    processItems: (items, formState = {}, isChild = false) ->
      collection = []
      for item in items
        item = @applyState(item, formState)
        if item.children and item.children.length > 0
          item.children = API.processItems(item.children, formState, true)
        collection.push item
      collection

    processSubmitted: (items, formState = {}, isChild = false) ->
      for item in items
        formState = @formatSubmittedValues(item, formState)
        if item.children and item.children.length > 0
          formState = API.processSubmitted(item.children.toJSON(), formState, true)
      formState

    toCollection: (items) ->
      for i, item of items
        if item.children and item.children.length > 0
          childCollection = new Entities.Form item.children
          items[i].children = childCollection
      new Entities.Form items


  ## Return a collection of form items parsed with the form state
  App.reqres.setHandler "form:item:entities", (form = [], formState = {}) ->
    API.toCollection API.processItems(form, formState)

  ## Apply correct formatting to submitted values
  App.reqres.setHandler "form:value:entities", (form = [], formState = {}) ->
    API.processSubmitted form, formState
