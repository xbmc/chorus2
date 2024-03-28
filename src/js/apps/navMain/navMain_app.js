// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("NavMain", function(NavMain, App, Backbone, Marionette, $, _) {

  const API = {

    getNav() {
      const navStructure = App.request('navMain:entities');
      return new NavMain.List({
        collection: navStructure});
    },

    getNavChildren(path, title = 'default') {
      const navStructure = App.request('navMain:entities', path);
      if (title !== 'default') {
        navStructure.set({title: tr(title)});
      }
      return new NavMain.ItemList({
        model: navStructure});
    },

    getNavCollection(collection, title) {
      const navStructure = new App.Entities.NavMain({
        title,
        items: collection
      });
      return new NavMain.ItemList({
        model: navStructure});
    }
  };

  this.onStart = options => App.vent.on("shell:ready", options => {
    const nav = API.getNav();
    return App.regionNav.show(nav);
  });

  App.reqres.setHandler("navMain:children:show", (path, title = 'default') => API.getNavChildren(path, title));

  App.reqres.setHandler("navMain:collection:show", (collection, title = '') => API.getNavCollection(collection, title));

  return App.vent.on("navMain:refresh", function() {
    const nav = API.getNav();
    return App.regionNav.show(nav);
  });
});
