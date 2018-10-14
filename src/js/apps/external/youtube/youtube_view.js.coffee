@Kodi.module "ExternalApp.Youtube", (Youtube, App, Backbone, Marionette, $, _) ->

  class Youtube.Item extends App.Views.ItemView
    template: 'apps/external/youtube/youtube'
    tagName: 'li'
    triggers:
      'click .play': 'youtube:play'
      'click .localplay': 'youtube:localplay'
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
      'click .play': 'youtube:play'
      'click .localplay': 'youtube:localplay'
    initialize: ->
      @getMeta()
    getMeta: ->
      if @model
        @model.set {subtitleHtml: @themeLink 'YouTube', @model.get('url'), {external: true}}
        if @model.get('addonEnabled')
          @model.set {menu: {localplay: 'Local play'}}
    onRender: () ->
      @makeLinksExternal()

  class Youtube.CardList extends App.Views.SetCompositeView
    childView: Youtube.Card
    className: "section-content card-grid--musicvideo"
