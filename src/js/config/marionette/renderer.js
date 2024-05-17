// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Extend Marionettes template renderer to use JST.
(function(Marionette) {
  return _.extend(Marionette.Renderer, {

    // So we don't have to add this to every template key.
    extension: [".jst"],

    // Override the default render method.
    render(template, data) {
      const path = this.getTemplate(template);
      if (!path) { throw `Template ${template} not found!`; }
      return path(data);
    },

    // Add 'tpl' as the part of the path so we don't have to call it each time.
    getTemplate(template) {
      let path = this.insertAt(template.split("/"), -1, "tpl").join("/");
      path = path + this.extension;
      if (JST[path]) { return JST[path]; }
    },

    insertAt(array, index, item) {
      array.splice(index, 0, item);
      return array;
    }
  }
  );
})(Marionette);
