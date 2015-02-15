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
      if @options
        if @options.entity
          $('h2.set-header', @$el).html( t.gettext( @options.entity + 's'  ) )
          if @options.more and @options.query
            moreLink = @themeLink t.gettext('Show More'), 'search/' + @options.entity + '/' + @options.query
            $('.more', @$el).html( moreLink )

    regions:
      regionResult: '.set-results'