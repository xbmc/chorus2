@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->


  ## Input commander
  class Api.Files extends Api.Commander

    commandNameSpace: 'Files'

    ## Prepare a file for download
    prepareDownload: (file, callback) ->
      @singleCommand @getCommand('PrepareDownload'), [file], (resp) =>
        @doCallback callback, resp

    ## Returns a download path for a file
    downloadPath: (file, callback) ->
      @prepareDownload file, (resp) =>
        @doCallback callback, resp.details.path

    ## Callback for a download button, will initiate a download
    downloadFile: (file) ->
      dl = window.open('about:blank', 'download')
      @downloadPath file, (path) ->
        dl.location = path

    ## Callback for video stream popup
    videoStream: (file, background = '', player = 'html5') ->
      st = helpers.global.localVideoPopup 'about:blank'
      @downloadPath file, (path) ->
        st.location = "videoPlayer.html?player=" + player + '&src=' + encodeURIComponent(path) + '&bg=' + encodeURIComponent(background)
