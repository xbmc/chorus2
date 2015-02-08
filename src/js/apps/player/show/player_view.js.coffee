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

      'click .control-prev'     : 'control:prev'
      'click .control-play'     : 'control:play'
      'click .control-next'     : 'control:next'
      'click .control-stop'     : 'control:stop'
      'click .control-mute'     : 'control:mute'
      'click .control-shuffle'  : 'control:shuffle'
      'click .control-repeat'   : 'control:repeat'
      'click .control-menu'     : 'control:menu'
