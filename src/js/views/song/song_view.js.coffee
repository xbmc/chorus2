@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.SongViewPlaceholder extends App.Views.ItemView
    template: "views/song/song_placeholder"
    tagName: 'tr'
    attributes: ->
      {
        class: 'song ph'
      }
    onRender: ->
      @$el.data('model', @model)
