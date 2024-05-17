// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ThumbsApp.List", (List, App, Backbone, Marionette, $, _) => //# Main controller
(function() {
  const Cls = (List.Controller = class Controller extends App.Controllers.Base {
    static initClass() {

      this.prototype.entityTitles =
        {musicvideo: 'music video'};
    }

    initialize() {
      this.layout = this.getLayout();
      const entities = ['song', 'artist', 'album', 'tvshow', 'movie', 'episode', 'musicvideo'];

      this.listenTo(this.layout, "show", () => {
        //# Do a search for each entity
        return entities.map((entity) =>
          this.getResult(entity));
      });
      return App.regionContent.show(this.layout);
    }

    getLayout() {
      return new List.ListLayout();
    }

    getResult(entity) {
      const query = this.getOption('query');
      const limit = this.getOption('media') === 'all' ? 'limit' : 'all';
      const loaded = App.request("thumbsup:get:entities", entity);
      //# If result
      if (loaded.length > 0) {
        //# Get the result view
        const view = App.request(`${entity}:list:view`, loaded, true);
        //# Wrap it in a set view container and add a title
        const setView = new List.ListSet({
          entity: this.getTitle(entity)});
        App.listenTo(setView, "show", () => {
          return setView.regionResult.show(view);
        });
        //# Add to layout
        return this.layout[`${entity}Set`].show(setView);
      }
    }

    //# Get title for an entity
    getTitle(entity) {
      const title = this.entityTitles[entity] ? this.entityTitles[entity] : entity;
      return title;
    }
  });
  Cls.initClass();
  return Cls;
})());
