@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  ## Shard functionality between composite and layout set views
  ## Template is also shared
  API =

    createModel: (options = {}) ->
      defaultMenu = {selectall: tr('Toggle select all')}
      model = _.extend {childViewTag: 'div', ChildViewClass: ''}, options
      if not options.noMenuDefault
        model.menu = if _.isObject(options.menu) then _.extend(defaultMenu, options.menu) else defaultMenu
      new Backbone.Model model

    toggleSelectAll: ($el) ->
      $ctx = $('.set__collection', $el)
      $('.card, .song', $ctx).toggleClass('selected').each (i, d) ->
        $d = $(d)
        op = if $(d).hasClass('selected') then 'add' else 'remove'
        App.execute "selected:update:items", op, $d.data('model').toJSON()


  ## A composite set view with a title, actions and collection
  class Views.SetCompositeView extends App.Views.CompositeView
    template: 'views/set/set'
    childView: App.Views.CardView
    tagName: 'div'
    className: "set__wrapper"
    childViewContainer: ".set__collection"
    events:
      "click .dropdown > i": "populateSetMenu"
      "click .selectall": "toggleSelectAll"

    initialize: () ->
      @createModel()

    # Create a model from options.
    createModel: () ->
      @model = API.createModel @options

    toggleSelectAll: ->
      API.toggleSelectAll @$el


  ## A set view is a layout view with a title, actions and collection
  class Views.SetLayoutView extends App.Views.LayoutView
    template: 'views/set/set'
    tagName: 'div'
    className: "set__wrapper"
    regions:
      regionCollection: ".set__collection"
    events:
      "click .dropdown > i": "populateSetMenu"
      "click .selectall": "toggleSelectAll"

    initialize: () ->
      @createModel()

    # Create a model from options.
    createModel: () ->
      @model = API.createModel @options

    toggleSelectAll: ->
      API.toggleSelectAll @$el

