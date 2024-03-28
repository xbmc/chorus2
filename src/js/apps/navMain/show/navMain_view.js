@Kodi.module "NavMain", (NavMain, App, Backbone, Marionette, $, _) ->

  class NavMain.List extends Backbone.Marionette.ItemView
    template: "apps/navMain/show/navMain"

  class NavMain.Item extends Backbone.Marionette.ItemView
    template: "apps/navMain/show/nav_item"
    tagName: "li"
    initialize: ->
      classes = []
      if @model.get('path') is helpers.url.path()
        classes.push 'active'
      tag = @themeLink(@model.get('title'), @model.get('path'), {'className': classes.join(' ')})
      @model.set(link: tag)

  class NavMain.ItemList extends App.Views.CompositeView
    template: 'apps/navMain/show/nav_sub'
    childView: NavMain.Item
    tagName: "div"
    childViewContainer: 'ul.items'
    className: "nav-sub"
    initialize: ->
      @collection = @model.get('items')
