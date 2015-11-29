@Kodi.module "HelpApp.Overview", (Overview, App, Backbone, Marionette, $, _) ->

  class Overview.Controller extends App.Controllers.Base

    initialize: (options) ->

      # Load the page
      App.request "help:page", 'help-overview', (data) =>

        @layout = @getLayoutView data
        @listenTo @layout, "show", =>
          @getSideBar()
          @getPage data

        # Render layout
        App.regionContent.show @layout

    getPage: (data) ->
      @pageView = new Overview.Page
        data: data
      @listenTo @pageView, "show", =>
	@getReport()

      @layout.regionContent.show @pageView

    getSideBar: ->
      subNav = App.request "help:subnav"
      @layout.regionSidebarFirst.show subNav

    getLayoutView: ->
      new Overview.Layout()

    getReport: ->

      # jQuery obj for page view
      @$pageView = @pageView.$el

      @getReportChorusVersion()
      @getReportKodiVersion()
      @getReportWebsocketsActive()
      @getReportLocalAudio()

      # We might have just called to early, bind to available event just in case.
      App.vent.on "sockets:available", =>
	@getReportWebsocketsActive()
      App.vent.on "state:initialized", =>
	@getReportKodiVersion()

    #
    # Callbacks for getting/setting report values below.
    # TODO: Refactor... Shouldn't be using jQuery to insert content
    #

    # Chorus version.
    getReportChorusVersion: ->
      $.get "addon.xml", (data) =>
	$('.report-chorus-version > span', @$pageView).html $('addon', data).attr('version')

    # Kodi version
    getReportKodiVersion: ->
      state = App.request "state:kodi"
      kodiVersion = state.getState('version')
      $('.report-kodi-version > span', @$pageView).html kodiVersion.major + '.' + kodiVersion.minor

    # Web sockets.
    getReportWebsocketsActive: ->
      wsActive = App.request "sockets:active"
      $ws = $('.report-websockets', @$pageView)
      if wsActive
	$('span', $ws).html tr("Remote control is set up correctly")
	$ws.removeClass 'warning'
      else
	$('span', $ws).html tr("You need to 'Allow remote control' for Kodi. You can do that") + ' <a href="#settings/kodi/services">' + tr('here') + '</a>'
	$ws.addClass 'warning'

    # Local audio
    getReportLocalAudio: ->
      localAudio = if soundManager.useHTML5Audio then "HTML 5" else "Flash"
      $('.report-local-audio > span', @$pageView) .html localAudio