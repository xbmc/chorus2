/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// View for the Lab.
//
// @param [Object] This app object
// @param [Object] The full application object
// @param [Object] Backbone
// @param [Object] Marionette
// @param [Object] jQuery
// @param [Object] lodash (underscore)
//
this.Kodi.module("LabApp.lab", function(lab, App, Backbone, Marionette, $, _) {

  // A single lab item
  let Cls = (lab.labItem = class labItem extends App.Views.ItemView {
    static initClass() {
      this.prototype.className = "lab--item";
      this.prototype.template = 'apps/lab/lab/lab_item';
      this.prototype.tagName = "div";
    }
  });
  Cls.initClass();

  // List of lab items
  return (function() {
    Cls = (lab.labItems = class labItems extends App.Views.CollectionView {
      static initClass() {
        this.prototype.tagName = "div";
        this.prototype.className = "lab--items page";
        this.prototype.childView = lab.labItem;
      }
      onRender() {
        this.$el.prepend($('<h3>').text( t.gettext('Experimental code, use at own risk') ));
        this.$el.prepend($('<h2>').text( t.gettext('The lab') ));
        return this.$el.addClass('page-secondary');
      }
    });
    Cls.initClass();
    return Cls;
  })();
});

