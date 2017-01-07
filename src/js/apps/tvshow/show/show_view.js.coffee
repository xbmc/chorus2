@Kodi.module "TVShowApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'tvshow-show tv-collection detail-container'

  class Show.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'tvshow-details'

  class Show.Details extends App.Views.DetailsItem
    template: 'apps/tvshow/show/details_meta'
    triggers:
      "click .play"               : "tvshow:play"
      "click .add"                : "tvshow:add"
      "click .edit"               : "tvshow:edit"
      "click .refresh"            : "tvshow:refresh"
      "click .refresh-episodes"   : "tvshow:refresh:episodes"
    attributes: ->
      @watchedAttributes 'details-meta'

  class Show.TVShowTeaser extends App.Views.CardView
    tagName: "div"
    triggers:
      "click .play"       : "tvshow:play"
    initialize: ->
        @model.set(actions: {thumbs: tr('Thumbs up')})
    attributes: ->
      @watchedAttributes 'card-detail'
