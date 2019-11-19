@Kodi.module "MusicVideoApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'musicvideo-show detail-container'

  class Show.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'musicvideo-details'

  class Show.Details extends App.Views.DetailsItem
    template: 'apps/musicvideo/show/details_meta'
    triggers:
      "click .play"       : "musicvideo:play"
      "click .add"        : "musicvideo:add"
      "click .download"   : "musicvideo:download"
      "click .localplay"  : "musicvideo:localplay"
      "click .edit"       : "musicvideo:edit"

  class Show.DetailTeaser extends App.MusicVideoApp.List.Teaser
    attributes: ->
      @watchedAttributes 'card-detail'
