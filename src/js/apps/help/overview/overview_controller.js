/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("HelpApp.Overview", function(Overview, App, Backbone, Marionette, $, _) {

  return Overview.Controller = class Controller extends App.Controllers.Base {

    initialize(options) {

      // Load the page
      return App.request("help:page", 'help-overview', data => {

        this.layout = this.getLayoutView(data);
        this.listenTo(this.layout, "show", () => {
          this.getSideBar();
          return this.getPage(data);
        });

        // Render layout
        return App.regionContent.show(this.layout);
      });
    }

    getPage(data) {
      this.pageView = new Overview.Page({
        data});
      this.listenTo(this.pageView, "show", () => {
        return this.getReport();
      });

      return this.layout.regionContent.show(this.pageView);
    }

    getSideBar() {
      const subNav = App.request("help:subnav");
      return this.layout.regionSidebarFirst.show(subNav);
    }

    getLayoutView() {
      return new Overview.Layout();
    }

    getReport() {

      // jQuery obj for page view
      this.$pageView = this.pageView.$el;

      this.getReportChorusVersion();
      this.getReportKodiVersion();
      this.getReportWebsocketsActive();
      this.getReportLocalAudio();

      // We might have just called to early, bind to available event just in case.
      App.vent.on("sockets:available", () => {
        return this.getReportWebsocketsActive();
      });
      return App.vent.on("state:initialized", () => {
        return this.getReportKodiVersion();
      });
    }

    //
    // Callbacks for getting/setting report values below.
    // TODO: Refactor... Shouldn't be using jQuery to insert content
    //

    // Chorus version.
    getReportChorusVersion() {
      return $.get("addon.xml", data => {
        return $('.report-chorus-version > span', this.$pageView).text($('addon', data).attr('version'));
      });
    }

    // Kodi version
    getReportKodiVersion() {
      const state = App.request("state:kodi");
      const kodiVersion = state.getState('version');
      return $('.report-kodi-version > span', this.$pageView).text(kodiVersion.major + '.' + kodiVersion.minor);
    }

    // Web sockets.
    getReportWebsocketsActive() {
      const wsActive = App.request("sockets:active");
      const $ws = $('.report-websockets', this.$pageView);
      if (wsActive) {
        $('span', $ws).text(tr("Remote control is set up correctly"));
        return $ws.removeClass('warning');
      } else {
        $('span', $ws).html(tr("You need to 'Allow remote control' for Kodi. You can do that") + ' <a href="#settings/kodi/services">' + tr('here') + '</a>');
        return $ws.addClass('warning');
      }
    }

    // Local audio
    getReportLocalAudio() {
      const localAudio = soundManager.useHTML5Audio ? "HTML 5" : "Flash";
      return $('.report-local-audio > span', this.$pageView) .text(localAudio);
    }
  };
});
