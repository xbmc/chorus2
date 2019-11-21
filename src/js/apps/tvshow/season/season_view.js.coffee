@Kodi.module "TVShowApp.Season", (Season, App, Backbone, Marionette, $, _) ->


  class Season.SeasonTeaser extends App.Views.CardView
    triggers:
      "click .play"       : "season:play"
      "click .watched"    : "season:watched"
      "click .add"        : "season:add"
    initialize: ->
      super arguments...
      subtitle = @model.get('episode') + ' ' + tr('episodes')
      @model.set subtitle: subtitle
      @model.set( App.request('tvshow:action:items') )
      @model.set({label: tr('Season') + ' ' + @model.get('season')})
    attributes: ->
      @watchedAttributes 'card tv-season prevent-select'

  class Season.Empty extends App.Views.EmptyViewResults
    tagName: "li"
    className: "season-empty-result"

  class Season.Seasons extends App.Views.CollectionView
    childView: Season.SeasonTeaser
    emptyView: Season.Empty
    tagName: "ul"
    className: "card-grid--tall"


  class Season.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'season-show tv-collection detail-container'

  class Season.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'season-details'

  class Season.Details extends App.Views.DetailsItem
    template: 'apps/tvshow/season/details_meta'
    triggers:
      "click .play"       : "season:play"
      "click .add"        : "season:add"
    attributes: ->
      @watchedAttributes 'details-meta'

  class Season.SeasonDetailTeaser extends App.Views.CardView
    tagName: "div"
    className: "card-detail"


