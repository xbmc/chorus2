/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("LoadingApp", function(LoadingApp, App, Backbone, Marionette, $, _) {

  const API = {

    getLoaderView(msgTextHtml = 'Just a sec...', inline = false) {
      return new LoadingApp.Show.Page({
        textHtml: msgTextHtml,
        // Inline is used when the loader is not full page
        inline
      });
    }
  };

  App.commands.setHandler("loading:show:view", function(region, msgTextHtml) {
    const view = API.getLoaderView(msgTextHtml);
    return region.show(view);
  });

  //# Replace whole page with loader.
  App.commands.setHandler("loading:show:page", () => App.execute("loading:show:view", App.regionContent));

  //# Get a loader view
  return App.reqres.setHandler("loading:get:view", (msgText, inline = true) => API.getLoaderView(msgText, inline));
});
