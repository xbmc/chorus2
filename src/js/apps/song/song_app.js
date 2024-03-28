// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SongApp", (SongApp, App, Backbone, Marionette, $, _) => App.commands.setHandler('song:edit', function(model) {
  const loadedModel = App.request("song:entity", model.get('songid'));
  return App.execute("when:entity:fetched", loadedModel, () => {
    return new SongApp.Edit.Controller({
      model: loadedModel});
  });
}));

