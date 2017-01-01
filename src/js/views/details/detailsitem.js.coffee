@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  # Use this for details meta header areas
  class Views.DetailsItem extends App.Views.ItemView
    events:
      "click .watched"             : "toggleWatched"
      "click .internal-search li"  : "internalSearch"
      "click .external-search li"  : "externalSearch"
      "click .youtube-search"      : "youtubeSearch"
    modelEvents:
      # This triggers a re-render on model update
      'change': 'render'
    onRender: ->
      if @model.get('fanart')
        @$el.closest('.detail-container').find('.region-details-fanart').css('background-image', 'url(' + @model.get('fanart') + ')')
      $('.description', @$el).attr('title', tr('Click for more')).on 'click', (e) ->
        $(@).toggleClass('expanded')
    ## Search using contextual query
    internalSearch: (e) ->
      $li = $(e.target)
      App.execute 'search:go', 'internal', $li.data('query'), $li.data('type')
    externalSearch: (e) ->
      $li = $(e.target)
      App.execute 'search:go', 'external', $li.data('query'), $li.data('type')
    youtubeSearch: (e) ->
      $li = $(e.target)
      App.execute "youtube:search:popup", $li.data('query')