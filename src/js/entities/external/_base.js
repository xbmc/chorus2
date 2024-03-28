// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  let Cls = (Entities.ExternalEntity = class ExternalEntity extends Entities.Model {
    static initClass() {
      this.prototype.defaults = {
        id: '',
        title: '',
        desc: '',
        thumbnail: '',
        url: '',
        type: '',
        provider: ''
      };
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Entities.ExternalCollection = class ExternalCollection extends Entities.Collection {
      static initClass() {
        this.prototype.model = Entities.ExternalEntity;
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
