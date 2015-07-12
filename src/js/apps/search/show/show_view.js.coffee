@Kodi.module "SearchApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Landing extends App.Views.ItemView
    template: 'apps/search/show/landing'
