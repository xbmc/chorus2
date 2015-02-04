@Kodi.module "Router", (Router, App, Backbone, Marionette, $, _) ->

  class Router.Base extends Marionette.AppRouter

    before: ( route, params ) ->
      ## Kick of loading.
      App.execute "loading:show:page"

    after: (route, params) ->
      ## After route set the body classes
      @setBodyClasses()

    ## Update the body class
    setBodyClasses: ->
      $body = App.getRegion('root').$el
      $body.removeClassRegex(/^section-/)
      $body.removeClassRegex(/^page-/)
      $body.addClass('section-' + helpers.url.arg(0))
      $body.addClass('page-' + helpers.url.arg().join('-'))

