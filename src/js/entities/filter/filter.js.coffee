@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->


  ## Filter entity.

  class Entities.Filter extends Entities.Model
    defaults:
      alias: ''
      type: 'string'
      key: ''
      sortOrder: 'asc'
      title: ''
      active: false

  class Entities.FilterCollection extends Entities.Collection
    model: Entities.Filter


  class Entities.FilterOption extends Entities.Model
    defaults:
      key: ''
      value: ''
      title: ''

  class Entities.FilterOptionCollection extends Entities.Collection
    model: Entities.Filter


  ## Sort entity.

  class Entities.FilterSort extends Entities.Model
    defaults:
      alias: ''
      type: 'string'
      defaultSort: false
      defaultOrder: 'asc'
      key: ''
      active: false
      order: 'asc'
      title: ''

  class Entities.FilterSortCollection extends Entities.Collection
    model: Entities.FilterSort


  ## Sort entity.

  class Entities.FilterActive extends Entities.Model
    defaults:
      key: ''
      values: []
      title: ''

  class Entities.FilterActiveCollection extends Entities.Collection
    model: Entities.FilterActive


  ## Requests.

  App.reqres.setHandler 'filter:filters:entities', (collection) ->
    new Entities.FilterCollection collection

  App.reqres.setHandler 'filter:filters:options:entities', (collection) ->
    new Entities.FilterOptionCollection collection

  App.reqres.setHandler 'filter:sort:entities', (collection) ->
    new Entities.FilterSortCollection collection

  App.reqres.setHandler 'filter:active:entities', (collection) ->
    new Entities.FilterActiveCollection collection
