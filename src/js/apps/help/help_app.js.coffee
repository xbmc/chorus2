@Kodi.module "HelpApp", (HelpApp, App, Backbone, Marionette, $, _) ->

  class HelpApp.Router extends App.Router.Base
    appRoutes:
      "help"          : "helpOverview"
      "help/overview" : "helpOverview"
      "help/:id"      : "helpPage"

  API =

    helpOverview: ->
      new App.HelpApp.Overview.Controller()

    helpPage: (id) ->
      new HelpApp.Show.Controller
        id: id

    # Get a html page with jQuery ajax
    getPage: (id, lang = 'en', callback) ->
      content = $.get("lang/#{lang}/#{id}.html")
      content.fail (error) ->
        if lang != 'en'
          API.getPage id, 'en', callback
      content.done (data) ->
        callback data
      content

    # Get second level nav
    getSubNav: ->
      collection = App.request "navMain:array:entities", @getSideBarStructure()
      App.request "navMain:collection:show", collection, t.gettext('Help topics')

    # Get second level nav structure
    # TODO: refactor into navMain
    getSideBarStructure: ->
      [
        {title: t.gettext('About'), path: 'help'}
        {title: t.gettext('Readme'), path: 'help/app-readme'}
        {title: t.gettext('Changelog'), path: 'help/app-changelog'}
        {title: t.gettext('Keyboard'), path: 'help/keybind-readme'}
        {title: t.gettext('Add-ons'), path: 'help/addons'}
        {title: t.gettext('Developers'), path: 'help/developers'}
        {title: t.gettext('Translations'), path: 'help/lang-readme'}
        {title: t.gettext('License'), path: 'help/license'}
      ]

  # Subnav for help
  App.reqres.setHandler 'help:subnav', ->
    API.getSubNav()

  # Get a page via jQuery, use current language
  App.reqres.setHandler 'help:page', (id, callback) ->
    lang = config.getLocal 'lang', 'en'
    API.getPage id, lang, callback

  ## Start the router.
  App.on "before:start", ->
    new HelpApp.Router
      controller: API
