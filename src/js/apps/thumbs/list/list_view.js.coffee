@Kodi.module "ThumbsApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutView
    template: 'apps/thumbs/list/thumbs_layout'
    className: "thumbs-page set-page"
    regions:
      artistSet: '.entity-set-artist'
      albumSet:  '.entity-set-album'
      songSet:   '.entity-set-song'
      movieSet:  '.entity-set-movie'
      tvshowSet: '.entity-set-tvshow'
      episodeSet: '.entity-set-episode'

  class List.ListSet extends App.Views.LayoutView
    template: 'apps/thumbs/list/thumbs_set'
    className: "thumbs-set"
    onRender: ->
      if @options
        if @options.entity
          $('h2.set-header', @$el).html( t.gettext( @options.entity + 's'  ) )
    regions:
      regionResult: '.set-results'