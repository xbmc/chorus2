// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {

  const _remove = Marionette.View.prototype.remove;

  return _.extend(Marionette.View.prototype, {

    // Build a link. Link text gets escaped.
    themeLink(name, url, options = {}) {
      _.defaults(options, {
        external: false,
        className: ''
      }
      );

      const attrs = {};

      if (options.external) {
        attrs.target = '_blank';
        attrs.href = url;
      } else {
        attrs.href = '#' + url;
      }

      if (options.className !== '') {
        attrs.class = options.className;
      }

      return $("<a>").attr(attrs).text(name).wrap('<div/>').parent().html();
    },

    // Make a tag. Contents can be HTML (they are not escaped)
    themeTag(el, attrs, value) {
      return $(`<${el}>`).attr(attrs).html(value).wrap('<div/>').parent().html();
    },

    // Formats dynamic text using filers. Returns HTML.
    formatText(text, addInLineBreaks = false) {
      // Filter via bb code (used in browser folder names)
      const res = XBBCODE.process({
        text,
        removeMisalignedTags: true,
        addInLineBreaks
      });
      if (res.error === !false) {
        helpers.debug.msg('formatText error: ' + res.errorQueue.join(', '), 'warning', res);
      }
      // return updated text
      return res.html;
    },

    //# Populate a dropdown menu with items from the model
    populateMenu(type = '') {
      let menu = '';
      const baseSelector = 'dropdown-menu';
      if (this.model.get('menu')) {
        const object = this.model.get('menu');
        for (var key in object) {
          var val = object[key];
          if (key.lastIndexOf('divider', 0) === 0) {
            key = 'divider';
          }
          menu += this.themeTag('li', {class: key}, val);
        }
        const selector = type !== '' ? type + ' .' + baseSelector : baseSelector;
        return this.$el.find('.' + selector).html(menu);
      }
    },

    populateModelMenu() {
      return this.populateMenu();
    },

    populateSetMenu() {
      return this.populateMenu('set__actions');
    }
  }
  );
});
