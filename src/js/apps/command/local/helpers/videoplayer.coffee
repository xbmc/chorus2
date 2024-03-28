@Kodi.module "CommandApp.Local", (Api, App, Backbone, Marionette, $, _) ->

  class Api.VideoPlayer extends Api.Player

    # files controller
    getKodiFilesController: ->
      new App.CommandApp.Kodi.Files

    # Play wrapper to match kodi controller
    play: (type, value, model) ->
      @videoStream model.get('file'), model.get('fanart')

    # Callback for video stream popup
    videoStream: (file, background = '', player = 'html5') ->
      st = helpers.global.localVideoPopup 'about:blank'
      @getKodiFilesController().downloadPath file, (path) ->
        st.location = "videoPlayer.html?player=" + player + '&src=' + encodeURIComponent(path) + '&bg=' + encodeURIComponent(background)
