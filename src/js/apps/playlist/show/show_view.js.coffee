@Kodi.module "PlaylistApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Landing extends App.Views.ItemView
    template: 'apps/playlist/show/landing'
