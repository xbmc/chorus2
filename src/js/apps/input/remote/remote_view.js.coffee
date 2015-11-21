@Kodi.module "InputApp.Remote", (Remote, App, Backbone, Marionette, $, _) ->

  class Remote.Control extends App.Views.ItemView
    template: 'apps/input/remote/remote_control'
    events:
      'click .input-button': 'inputClick'
      'click .player-button': 'playerClick'
    triggers:
      'click .power-button': 'remote:power'
      'click .info-button': 'remote:info'

    inputClick: (e) ->
      type = $(e.target).data('type')
      @trigger 'remote:input', type

    playerClick: (e) ->
      type = $(e.target).data('type')
      @trigger 'remote:player', type

    class Remote.Landing extends App.Views.ItemView
