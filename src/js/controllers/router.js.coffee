@Kodi.module "Router", (Router, App, Backbone, Marionette, $, _) ->

  class Router.Base extends Marionette.AppRouter

    before: ( route, params ) ->
      ## Kick of loading.
      App.execute "loading:show:page"
      App.execute "selected:clear:items"

    after: (route, params) ->
      ## After route set the body classes
      @setBodyClasses()

    ## Update the body class
    setBodyClasses: ->
      $body = App.getRegion('root').$el
      $body.removeClassRegex(/^section-/)
      $body.removeClassRegex(/^page-/)
      section = helpers.url.arg(0)
      if section is ''
        section = 'home'
      $body.addClass('section-' + section)
      $body.addClass('page-' + helpers.url.arg().join('-'))

