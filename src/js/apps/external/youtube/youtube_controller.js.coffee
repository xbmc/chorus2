@Kodi.module "ExternalApp.Youtube", (Youtube, App, Backbone, Marionette, $, _) ->

  API =

    getSearchView: (query, viewName, title = '', options = {}, callback) ->
      App.execute "youtube:search:entities", query, options, (collection) ->
        view = new Youtube[viewName]
          collection: collection
          title: title
        App.listenTo view, 'childview:youtube:kodiplay', (parent, item) ->
          playlist = App.request "command:kodi:controller", 'video', 'PlayList'
          playlist.play 'file', 'plugin://plugin.video.youtube/play/?video_id=' + item.model.get('id')
        App.listenTo view, 'childview:youtube:localplay', (parent, item) ->
          localPlayer = "videoPlayer.html?yt=" + item.model.get('id')
          helpers.global.localVideoPopup localPlayer, 530
        callback view


  App.commands.setHandler "youtube:search:view", (query, callback) ->
    API.getSearchView query, 'List', '', {}, callback

  App.commands.setHandler "youtube:search:popup", (query) ->
    API.getSearchView query, 'List', '', {}, (view) ->
      $footer = $('<a>', {class: 'btn btn-primary', href: 'https://www.youtube.com/results?search_query=' + query, target: '_blank'})
      $footer.html('More videos')
      App.execute "ui:modal:show", query, view.render().$el, $footer

  App.commands.setHandler "youtube:list:view", (query, title, options = {}, callback) ->
    API.getSearchView query, 'CardList', title, options, callback