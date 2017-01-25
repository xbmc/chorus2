@Kodi.module "ExternalApp.Youtube", (Youtube, App, Backbone, Marionette, $, _) ->

  class Youtube.Item extends App.Views.ItemView
    template: 'apps/external/youtube/youtube'
    tagName: 'li'
    triggers:
      'click .play-kodi': 'youtube:kodiplay'
      'click .play-local': 'youtube:localplay'
    events:
      'click .action': 'closeModal'
    closeModal: ->
      App.execute "ui:modal:close"

  class Youtube.List extends App.Views.CollectionView
    childView: Youtube.Item
    tagName: 'ul'
    className: 'youtube-list'

  class Youtube.Card extends App.Views.CardView
    triggers:
      'click .play': 'youtube:kodiplay'
      'click .localplay': 'youtube:localplay'
    initialize: ->
      @getMeta()
    getMeta: ->
      if @model
        @model.set {subtitle: @themeLink 'YouTube', @model.get('url'), {external: true}}
        if @model.get('addonEnabled')
          @model.set {menu: {localplay: 'Local play'}}
    onRender: () ->
      @makeLinksExternal()

  class Youtube.CardList extends App.Views.CompositeView
    template: 'apps/external/youtube/set'
    childView: Youtube.Card
    tagName: 'div'
    className: "section-content"
    childViewContainer: ".set-container"
    onRender: ->
      $('.set-title', @$el).html @options.title
