@Kodi.module "SearchApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.PageLayout extends App.Views.LayoutWithSidebarFirstView
    className: "search-page-layout"

  class List.ListLayout extends App.Views.LayoutView
    template: 'apps/search/list/search_layout'
    className: "search-page set-page"
    regions:
      artistSet: '.entity-set-artist'
      albumSet:  '.entity-set-album'
      songSet:   '.entity-set-song'
      movieSet:  '.entity-set-movie'
      tvshowSet: '.entity-set-tvshow'
      musicvideoSet: '.entity-set-musicvideo'
      loadingSet: '.entity-set-loading'
    # Allow dynamically adding multiple addon views to a region
    appendAddonView: (addonId, addonView) ->
      addonViewId = 'addonSet_' + addonId.split('.').join('_')
      $('.entity-set-addons', @$el).append '<div id="' + addonViewId+ '">'
      @regionManager.addRegion addonViewId, '#' + addonViewId
      this[addonViewId].show addonView

  class List.ListSet extends App.Views.LayoutView
    template: 'apps/search/list/search_set'
    className: "search-set"
    onRender: ->
      if @options and @options.entity
        if @options.title
          $('h2.set-header', @$el).html( t.gettext( @options.title ) )
        else
          $('h2.set-header', @$el).remove()
        if @options.more and @options.query
          moreLink = @themeLink t.gettext('Show more'), 'search/' + @options.entity + '/' + @options.query
          $('.more', @$el).html( moreLink )
    regions:
      regionResult: '.set-results'

  ## List of sidebar links for media and addons
  class List.Sidebar extends App.Views.LayoutView
    template: 'apps/search/list/search_sidebar'
    className: "search-sidebar"
    onRender: ->
      query = encodeURIComponent @options.query
      for type, links of @options.links
        if links.length is 0
          $('.sidebar-section-' + type, @$el).remove()
        else
          $list = $('.search-' + type + '-links', @$el)
          for item in links
            active = if helpers.url.arg(1) is item.id then 'active' else ''
            link = @themeLink t.gettext(item.title), 'search/' + item.id + '/' + query, {className: active}
            $list.append @themeTag 'li', {}, link