@Kodi.module "SongApp.List", (List, App, Backbone, Marionette, $, _) ->

  ## Single song row
  class List.Song extends App.Views.ItemView
    template: 'apps/song/list/song'
    tagName: "tr"
    initialize: ->
      super
      if @model
        duration = helpers.global.secToTime this.model.get('duration')
        menu =
          'song-localadd': 'Add to playlist'
          'song-download': 'Download song'
          'song-localplay': 'Play in browser'
          'song-musicvideo': 'Music video'
          'divider' : ''
          'song-edit': 'Edit'
        this.model.set({displayDuration: helpers.global.formatTime(duration), menu: menu})

    triggers:
      "click .play"            : "song:play"
      "dblclick .song-title"   : "song:play"
      "click .add"             : "song:add"
      "click .song-localadd"   : "song:localadd"
      "click .song-download"   : "song:download"
      "click .song-localplay"  : "song:localplay"
      "click .song-musicvideo" : "song:musicvideo"
      "click .song-remove"     : "song:remove"
      "click .song-edit"            : "song:edit"

    events:
      "click .dropdown > i": "populateModelMenu"
      "click .thumbs" : "toggleThumbs"
      "click": "toggleSelect"

    ## This triggers a re-render on model update
    modelEvents:
      'change': 'render'

    toggleThumbs: ->
      App.request "thumbsup:toggle:entity", @model
      this.$el.toggleClass 'thumbs-up'
      $('.plitem-' + @model.get('type') + '-' + @model.get('id')).toggleClass 'thumbs-up'

    attributes: ->
      if @model
        classes = ['song', 'table-row', 'can-play', 'item-' + @model.get('uid')]
        if App.request "thumbsup:check", @model
          classes.push 'thumbs-up'
        {
          'class': classes.join(' ')
          'data-id': @model.id
        }

    onShow: ->
      @menuBlur()

    onRender: ->
      @$el.data('model', @model)


  ## Song list
  class List.Songs extends App.Views.VirtualListView
    childView: List.Song
    placeHolderViewName: 'SongViewPlaceholder'
    cardSelector: '.song'
    preload: 40
    tagName: "table"
    attributes: ->
      verbose = if @options.verbose then 'verbose' else 'basic'
      {
        class: 'songs-table table table-hover ' + verbose
      }
