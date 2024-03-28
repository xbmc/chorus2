/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CastApp", function(CastApp, App, Backbone, Marionette, $, _) {


  const API = {

    getCastCollection(cast, origin) {
      return App.request("cast:entities", cast, origin);
    },

    getCastView(collection) {
      const view = new CastApp.List.CastList({
        collection});
      App.listenTo(view, 'childview:cast:google', (parent, child) => window.open('https://www.google.com/webhp?#q=' + encodeURIComponent(child.model.get('name'))));
      App.listenTo(view, 'childview:cast:imdb', (parent, child) => window.open('http://www.imdb.com/find?s=nm&q=' + encodeURIComponent(child.model.get('name'))));
      return view;
    }
  };


  return App.reqres.setHandler('cast:list:view', function(cast, origin) {
    const collection = API.getCastCollection(cast, origin);
    return API.getCastView(collection);
  });
});
