@Kodi.module "AddonApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "addon-list"

  class List.Teaser extends App.Views.CardView
    tagName: "li"

  class List.Addons extends App.Views.CollectionView
    childView: List.Teaser
    emptyView: App.Views.EmptyViewResults
    tagName: "ul"
    sort: 'name'
    className: "card-grid--square"
