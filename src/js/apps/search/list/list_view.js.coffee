@Kodi.module "SearchApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutView
    template: 'apps/search/list/search_layout'
    className: "search-page"
    regions:
      artistSet: '.search-set-artist'
      albumSet:  '.search-set-album'
      songSet:   '.search-set-song'
      movieSet:  '.search-set-movie'
      tvshowSet: '.search-set-tvshow'

  class List.ListSet extends App.Views.LayoutView
    template: 'apps/search/list/search_set'
    className: "search-set"
    onRender: ->
      if @options and @options.title
        $('h2.set-header', @$el).html( t.gettext( @options.title  ) )
    regions:
      regionResult: '.set-results'