@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.CardView extends App.Views.ItemView
    template: "views/card/card"
    tagName: "li"
    className: "card"
    triggers:
      "click .menu" : "artist-menu:clicked"

