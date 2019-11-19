@Kodi.module "PlaylistApp.M3u", (M3u, App, Backbone, Marionette, $, _) ->

  class M3u.List extends App.Views.LayoutView
    template: 'apps/playlist/m3u/list'
    tagName: "pre"
    className: "m3u-export"
    onRender: ->
      content = @$el.text();
      # TODO: Don't get filename from the dom!
      filename = $('.local-playlist-header h2').html() + ".m3u";
      helpers.global.saveFileText content, filename

