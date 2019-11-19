@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.CompositeView extends Backbone.Marionette.CompositeView
    itemViewEventPrefix: "childview"
