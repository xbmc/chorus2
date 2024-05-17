// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Router", function(Router, App, Backbone, Marionette, $, _) {

  return Router.Base = class Base extends Marionette.AppRouter {

    before( route, params ) {
      //# Kick of loading.
      App.execute("loading:show:page");
      return App.execute("selected:clear:items");
    }

    after(route, params) {
      //# After route set the body classes
      return this.setBodyClasses();
    }

    //# Update the body class
    setBodyClasses() {
      const $body = App.getRegion('root').$el;
      $body.removeClassRegex(/^section-/);
      $body.removeClassRegex(/^page-/);
      let section = helpers.url.arg(0);
      if (section === '') {
        section = 'home';
      }
      $body.addClass('section-' + section);
      return $body.addClass('page-' + helpers.url.arg().join('-'));
    }
  };
});

