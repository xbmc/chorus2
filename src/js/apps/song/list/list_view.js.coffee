@Kodi.module "SongApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Song extends App.Views.ItemView
    template: 'apps/song/list/song'
    tagName: "tr"
    initialize: ->
      duration = helpers.global.secToTime this.model.get('duration')
      this.model.set duration: helpers.global.formatTime duration
    triggers:
      "click .play"           : "song:play"
      "dblclick .song-title"  : "song:play"
      "click .add"           : "song:add"
    attributes: ->
      {
      class: 'song table-row can-play item-song-' + @model.get('songid')
      }

  class List.Songs extends App.Views.CollectionView
    childView: List.Song
    tagName: "table"
    className: "songs-table table table-striped table-hover"