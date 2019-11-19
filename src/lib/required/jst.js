/**
 * Templates are compiled into javascript using JST and ECO.
 *
 * @see https://www.npmjs.com/package/universal-jst
 * @see https://github.com/tommcc/grunt-eco
 *
 * This code is added to prevent it being added to every template.
 * Meaning we can set this in our Gruntfile - eco.app.options.jstGlobalCheck: false
 */
if (!window.JST) {
  window.JST = {};
}
