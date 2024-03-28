/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ThumbsApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.ListLayout = class ListLayout extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = 'apps/thumbs/list/thumbs_layout';
      this.prototype.className = "thumbs-page set-page";
      this.prototype.regions = {
        artistSet: '.entity-set-artist',
        albumSet:  '.entity-set-album',
        songSet:   '.entity-set-song',
        movieSet:  '.entity-set-movie',
        tvshowSet: '.entity-set-tvshow',
        episodeSet: '.entity-set-episode',
        musicvideoSet: '.entity-set-musicvideo'
      };
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.ListSet = class ListSet extends App.Views.LayoutView {
      static initClass() {
        this.prototype.template = 'apps/thumbs/list/thumbs_set';
        this.prototype.className = "thumbs-set";
        this.prototype.regions =
          {regionResult: '.set-results'};
      }
      onRender() {
        if (this.options) {
          if (this.options.entity) {
            return $('h2.set-header', this.$el).text( t.gettext( this.options.entity + 's'  ) );
          }
        }
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
