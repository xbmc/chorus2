@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.EmptyView extends App.Views.ItemView
    template: "views/empty/empty"
    regions:
      regionEmptyContent:  ".region-empty-content"
