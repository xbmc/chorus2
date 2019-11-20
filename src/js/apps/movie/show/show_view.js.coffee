@Kodi.module "MovieApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'movie-show detail-container'

  class Show.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'movie-details'

  class Show.Details extends App.Views.DetailsItem
    template: 'apps/movie/show/details_meta'
    triggers:
      'click .play': 'movie:play'
      'click .add': 'movie:add'
      'click .stream': 'movie:localplay'
      'click .download': 'movie:download'
      'click .edit': 'movie:edit'
      'click .refresh': 'movie:refresh'
    attributes: ->
      @watchedAttributes()

  class Show.MovieTeaser extends App.Views.CardView
    tagName: "div"
    triggers:
      'click .play': 'movie:play'
    initialize: ->
      @model.set(actions: {thumbs: tr('Thumbs up')})
    attributes: ->
      @watchedAttributes 'card-detail'

  class Show.Content extends App.Views.LayoutView
    template: 'apps/movie/show/content'
    className: "movie-content content-sections"
    triggers:
      'click .youtube': 'movie:youtube'
    regions:
      regionCast: '.region-cast'
      regionMore1: '.region-more-1'
      regionMore2: '.region-more-2'
      regionMore3: '.region-more-3'
      regionMore4: '.region-more-4'
      regionMore5: '.region-more-5'
    modelEvents:
      'change': 'modelChange'
    modelChange: () ->
      @render()
      @trigger 'show'

  class Show.Set extends App.Views.LayoutView
    template: 'apps/movie/show/set'
    className: 'movie-set'
    onRender: ->
      if @options and @options.set
          $('h2.set-name', @$el).html( @options.set )
    regions: ->
      regionCollection: '.collection-items'
