// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ExternalApp.Youtube", function(Youtube, App, Backbone, Marionette, $, _) {

  var API = {

    getSearchView(query, viewName, title = '', options = {}, callback) {
      return App.execute("youtube:search:entities", query, options, function(collection) {
        const view = new (Youtube[viewName])({
          collection,
          title
        });
        App.listenTo(view, 'childview:youtube:play', function(parent, item) {
          if (item.model.get('addonEnabled')) {
            return API.playKodi(item.model.get('id'));
          } else {
            return API.playLocal(item.model.get('id'));
          }
        });
        App.listenTo(view, 'childview:youtube:localplay', (parent, item) => API.playLocal(item.model.get('id')));
        return callback(view);
      });
    },

    playLocal(id) {
      const localPlayer = "videoPlayer.html?yt=" + id;
      return helpers.global.localVideoPopup(localPlayer, 530);
    },

    playKodi(id) {
      const playlist = App.request("command:kodi:controller", 'video', 'PlayList');
      return playlist.play('file', 'plugin://plugin.video.youtube/play/?video_id=' + id);
    }
  };


  App.commands.setHandler("youtube:search:view", (query, callback) => API.getSearchView(query, 'List', '', {}, callback));

  App.commands.setHandler("youtube:search:popup", query => API.getSearchView(query, 'List', '', {}, function(view) {
    const $footer = $('<a>', {class: 'btn btn-primary', href: 'https://www.youtube.com/results?search_query=' + query, target: '_blank'});
    $footer.html('More videos');
    return App.execute("ui:modal:show", _.escape(query), view.render().$el, $footer);
  }));

  return App.commands.setHandler("youtube:list:view", (query, title, options = {}, callback) => API.getSearchView(query, 'CardList', title, options, callback));
});
