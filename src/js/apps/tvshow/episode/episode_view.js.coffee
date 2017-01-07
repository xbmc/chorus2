@Kodi.module "TVShowApp.Episode", (Episode, App, Backbone, Marionette, $, _) ->


  class Episode.EpisodeTeaser extends App.Views.CardView
    triggers:
      "click .play"        : "episode:play"
      "click .watched"     : "episode:watched"
      "click .add"         : "episode:add"
      "click .localplay"   : "episode:localplay"
      "click .download"    : "episode:download"
      "click .goto-season" : "episode:goto:season"
      "click .edit"        : "episode:edit"
    initialize: ->
      super
      if @model?
        @setMeta()
        @model.set(App.request('episode:action:items'))
    attributes: ->
      @watchedAttributes 'card'
    setMeta: ->
      epNum = @themeTag('span', {class: 'ep-num'}, @model.get('season') + 'x' + @model.get('episode') + ' ')
      epNumFull = @themeTag('span', {class: 'ep-num-full'}, t.gettext('Episode') + ' ' + @model.get('episode'))
      showLink = @themeLink(@model.get('showtitle') + ' ', 'tvshow/' + @model.get('tvshowid'), {className: 'show-name'})
      @model.set
        label: epNum + @model.get('title')
        subtitle: showLink + epNumFull


  class Episode.Empty extends App.Views.EmptyViewResults
    tagName: "li"
    className: "episode-empty-result"

  class Episode.Episodes extends App.Views.CollectionView
    childView: Episode.EpisodeTeaser
    emptyView: Episode.Empty
    tagName: "ul"
    className: "card-grid--episode"


  class Episode.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'episode-show detail-container'

  class Episode.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'episode-details'

  class Episode.Details extends App.Views.DetailsItem
    template: 'apps/tvshow/episode/details_meta'
    triggers:
      'click .play': 'episode:play'
      'click .add': 'episode:add'
      'click .stream': 'episode:localplay'
      'click .download': 'episode:download'
      'click .edit': 'episode:edit'
      'click .refresh': 'episode:refresh'
    attributes: ->
      @watchedAttributes()

  class Episode.EpisodeDetailTeaser extends App.Views.CardView
    tagName: "div"
    triggers:
      "click .menu" : "episode-menu:clicked"
    initialize: ->
      @model.set(actions: {thumbs: tr('Thumbs up')})
    attributes: ->
      @watchedAttributes 'card-detail'

  class Episode.Content extends App.Views.LayoutView
    template: 'apps/tvshow/episode/content'
    className: "episode-content content-sections"
    regions:
      regionCast: '.region-cast'
      regionSeason: '.region-season'
    modelEvents:
      'change': 'modelChange'
    modelChange: () ->
      @render()
      @trigger 'show'