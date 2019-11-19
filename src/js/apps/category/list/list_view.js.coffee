@Kodi.module "CategoryApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "category-list"

  class List.Item extends App.Views.CardView
    template: 'apps/category/list/item'
    tagName: "li"
    className: "card category"

  class List.CategoryList extends App.Views.CollectionView
    childView: List.Item
    tagName: "ul"
    className: "card-grid--square"
