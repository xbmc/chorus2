// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("HelpApp", function(HelpApp, App, Backbone, Marionette, $, _) {

  const Cls = (HelpApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "help"          : "helpOverview",
        "help/overview" : "helpOverview",
        "help/:id"      : "helpPage"
      };
    }
  });
  Cls.initClass();

  var API = {

    helpOverview() {
      return new App.HelpApp.Overview.Controller();
    },

    helpPage(id) {
      return new HelpApp.Show.Controller({
        id});
    },

    // Get a html page with jQuery ajax
    getPage(id, lang = 'en', callback) {
      const content = $.get(`lang/${lang}/${id}.html`);
      content.fail(function(error) {
        if (lang !== 'en') {
          return API.getPage(id, 'en', callback);
        }
      });
      content.done(data => callback(data));
      return content;
    },

    // Get second level nav
    getSubNav() {
      const collection = App.request("navMain:array:entities", this.getSideBarStructure());
      return App.request("navMain:collection:show", collection, t.gettext('Help topics'));
    },

    // Get second level nav structure
    // TODO: refactor into navMain
    getSideBarStructure() {
      return [
        {title: t.gettext('About'), path: 'help'},
        {title: t.gettext('Readme'), path: 'help/app-readme'},
        {title: t.gettext('Changelog'), path: 'help/app-changelog'},
        {title: t.gettext('Keyboard'), path: 'help/keybind-readme'},
        {title: t.gettext('Add-ons'), path: 'help/addons'},
        {title: t.gettext('Developers'), path: 'help/developers'},
        {title: t.gettext('Translations'), path: 'help/lang-readme'},
        {title: t.gettext('License'), path: 'help/license'}
      ];
    }
  };

  // Subnav for help
  App.reqres.setHandler('help:subnav', () => API.getSubNav());

  // Get a page via jQuery, use current language
  App.reqres.setHandler('help:page', function(id, callback) {
    const lang = config.getLocal('lang', 'en');
    return API.getPage(id, lang, callback);
  });

  //# Start the router.
  return App.on("before:start", () => new HelpApp.Router({
    controller: API}));
});
