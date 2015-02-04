@Kodi.module "PlayerApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Player extends App.Views.ItemView
    template: "apps/player/show/player"
    regions:
      regionProgress  : '.playing-progress'
      regionVolume    : '.volume'
      regionThumbnail : '.playing-thumb'
      regionTitle     : '.playing-title'
      regionSubtitle  : '.playing-subtitle'
      regionTimeCur   : '.playing-time-current'
      regionTimeDur   : '.playing-time-duration'
    triggers:
      'click .control-prev'     : 'conrol:prev'
      'click .control-play'     : 'conrol:play'
      'click .control-next'     : 'conrol:next'
      'click .control-stop'     : 'conrol:stop'
      'click .control-mute'     : 'conrol:mute'
      'click .control-shuffle'  : 'conrol:shuffle'
      'click .control-repeat'   : 'conrol:repeat'
      'click .control-menu'     : 'conrol:menu'