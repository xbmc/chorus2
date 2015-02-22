@Kodi.module "TVShowApp.Season", (Season, App, Backbone, Marionette, $, _) ->


  class Season.SeasonTeaser extends App.Views.CardView
    triggers:
      "click .play" : "season:play"
    initialize: ->
      super
      @model.set({label: 'Season ' + @model.get('season')})

  class Season.Empty extends App.Views.EmptyView
    tagName: "li"
    className: "season-empty-result"

  class Season.Seasons extends App.Views.CollectionView
    childView: Season.SeasonTeaser
    emptyView: Season.Empty
    tagName: "ul"
    className: "card-grid--tall"


  class Season.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'season-show detail-container'

  class Season.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'season-details'

  class Season.Details extends App.Views.ItemView
    template: 'apps/tvshow/season/details_meta'

  class Season.SeasonDetailTeaser extends App.Views.CardView
    tagName: "div"
    className: "card-detail"
    triggers:
      "click .menu" : "season-menu:clicked"

