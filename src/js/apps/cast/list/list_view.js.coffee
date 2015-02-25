@Kodi.module "CastApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.CastTeaser extends App.Views.ItemView
    template: 'apps/cast/list/cast'
    tagName: "li"
    triggers:
      "click .imdb"       : "cast:imdb"
      "click .google"    : "cast:google"

  class List.CastList extends App.Views.CollectionView
    childView: List.CastTeaser
    tagName: "ul"
    className: "cast-full"