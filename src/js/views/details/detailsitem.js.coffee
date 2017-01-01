@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  # Use this for details meta header areas
  class Views.DetailsItem extends App.Views.ItemView
    events:
      "click .watched"    : "toggleWatched"
    ## This triggers a re-render on model update
    modelEvents:
      'change': 'render'
    onRender: ->
      if @model.get('fanart')
        @$el.closest('.detail-container').find('.region-details-fanart').css('background-image', 'url(' + @model.get('fanart') + ')')
      $('.description', @$el).attr('title', tr('Click for more')).on 'click', (e) ->
        $(@).toggleClass('expanded')