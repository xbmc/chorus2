/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", (Views, App, Backbone, Marionette, $, _) => // Use this for details meta header areas
(function() {
  const Cls = (Views.DetailsItem = class DetailsItem extends App.Views.ItemView {
    static initClass() {
      this.prototype.events = {
        "click .watched"             : "toggleWatched",
        "click .internal-search li"  : "internalSearch",
        "click .external-search li"  : "externalSearch",
        "click .youtube-search"      : "youtubeSearch"
      };
      this.prototype.modelEvents =
        // This triggers a re-render on model update
        {'change': 'modelChange'};
    }
    modelChange() {
      return this.render();
    }
    onRender() {
      if (this.model.get('fanart')) {
        this.$el.closest('.detail-container').find('.region-details-fanart').css('background-image', 'url(' + this.model.get('fanart') + ')');
      }
      return $('.description', this.$el).attr('title', tr('Click for more')).on('click', function(e) {
        return $(this).toggleClass('expanded');
      });
    }
    //# Search using contextual query
    internalSearch(e) {
      const $li = $(e.target);
      return App.execute('search:go', 'internal', $li.data('query'), $li.data('type'));
    }
    externalSearch(e) {
      const $li = $(e.target);
      return App.execute('search:go', 'external', $li.data('query'), $li.data('type'));
    }
    youtubeSearch(e) {
      const $li = $(e.target);
      return App.execute("youtube:search:popup", $li.data('query'));
    }
  });
  Cls.initClass();
  return Cls;
})());
