@Kodi.module "TVShowApp.Episode", (Episode, App, Backbone, Marionette, $, _) ->


  class Episode.EpisodeTeaser extends App.Views.CardView
    triggers:
      "click .play"       : "episode:play"
      "click .watched"    : "episode:watched"
      "click .add"        : "episode:add"
      "click .localplay"  : "episode:localplay"
      "click .download"   : "episode:download"
    initialize: ->
      super
      if @model?
        @model.set(@getMeta())
        @model.set({actions: {watched: 'Watched'}})
        @model.set({menu: {add: 'Add to Kodi playlist', divider: '', download: 'Download', localplay: 'Play in browser'}})
    attributes: ->
      classes = ['card']
      if helpers.entities.isWatched @model
        classes.push 'is-watched'
      {
        class: classes.join(' ')
      }
    getMeta: ->
      epNum = @themeTag('span', {class: 'ep-num'}, @model.get('season') + 'x' + @model.get('episode') + ' ')
      epNumFull = @themeTag('span', {class: 'ep-num-full'}, t.gettext('Episode') + ' ' + @model.get('episode'))
      showLink = @themeLink(@model.get('showtitle') + ' ', 'tvshow/' + @model.get('tvshowid'), {className: 'show-name'})
      {
        label: epNum + @model.get('title')
        subtitle: showLink + epNumFull
      }

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

  class Episode.Details extends App.Views.ItemView
    template: 'apps/tvshow/episode/details_meta'
    triggers:
      'click .play': 'episode:play'
      'click .add': 'episode:add'
      'click .stream': 'episode:localplay'
      'click .download': 'episode:download'
      
  class Episode.EpisodeDetailTeaser extends App.Views.CardView
    tagName: "div"
    className: "card-detail"
    triggers:
      "click .menu" : "episode-menu:clicked"

  class Episode.Content extends App.Views.LayoutView
    template: 'apps/tvshow/episode/content'
    className: "episode-content content-sections"
    regions:
      regionCast: '.region-cast'
