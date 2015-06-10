@Kodi.module "SearchApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutView
    template: 'apps/search/list/search_layout'
    className: "search-page set-page"
    regions:
      artistSet: '.entity-set-artist'
      albumSet:  '.entity-set-album'
      songSet:   '.entity-set-song'
      movieSet:  '.entity-set-movie'
      tvshowSet: '.entity-set-tvshow'

  class List.ListSet extends App.Views.LayoutView
    template: 'apps/search/list/search_set'
    className: "search-set"
    onRender: ->
      if @options
        if @options.entity
          $('h2.set-header', @$el).html( t.gettext( @options.entity + 's'  ) )
          if @options.more and @options.query
            moreLink = @themeLink t.gettext('Show more'), 'search/' + @options.entity + '/' + @options.query
            $('.more', @$el).html( moreLink )

    regions:
      regionResult: '.set-results'