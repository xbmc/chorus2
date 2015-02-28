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

