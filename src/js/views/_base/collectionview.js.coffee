@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
  class Views.CollectionView extends Backbone.Marionette.CollectionView
    itemViewEventPrefix: "childview"
    onShow: ->
      $("img.lazy").lazyload({
        threshold : 200
      });
