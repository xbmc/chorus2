/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {

  let Cls = (Views.LayoutWithSidebarFirstView = class LayoutWithSidebarFirstView extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = "views/layouts/layout_with_sidebar_first";
      this.prototype.regions = {
        regionSidebarFirst:  ".region-first-primary",
        regionContent:  ".region-content"
      };
      this.prototype.events =
        {"click .region-first-toggle": "toggleRegionFirst"};
    }
    toggleRegionFirst() {
      return this.$el.toggleClass('region-first-open');
    }
    // Allow dynamically adding multiple sidebar views to a region
    appendSidebarView(viewId, appendView) {
      $('.region-first-secondary', this.$el).append('<div id="' + viewId + '">');
      this.regionManager.addRegion(viewId, '#' + viewId);
      return this[viewId].show(appendView);
    }
  });
  Cls.initClass();

  Cls = (Views.LayoutWithHeaderView = class LayoutWithHeaderView extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = "views/layouts/layout_with_header";
      this.prototype.regions = {
        regionHeader:  ".region-header",
        regionContentTop:  ".region-content-top",
        regionContent:  ".region-content"
      };
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Views.LayoutDetailsHeaderView = class LayoutDetailsHeaderView extends App.Views.LayoutView {
      static initClass() {
        this.prototype.template = "views/layouts/layout_details_header";
        this.prototype.regions = {
          regionSide:  ".region-details-side",
          regionTitle:  ".region-details-title",
          regionMeta: ".region-details-meta", //# Using this region removes the below regions.
          regionMetaSideFirst:  ".region-details-meta-side-first",
          regionMetaSideSecond:  ".region-details-meta-side-second",
          regionMetaBelow:  ".region-details-meta-below",
          regionFanart:  ".region-details-fanart"
        };
      }
      onRender() {
        //# Get swatches
        return helpers.ui.getSwatch(this.model.get('thumbnail'), swatches => helpers.ui.applyHeaderSwatch(swatches));
      }
      initialize() {
        if (!this.model.get('progress')) {
          return this.model.set({progress: 0});
        }
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
