@Kodi.module "ExternalApp.MusicBrainz", (Provider, App, Backbone, Marionette, $, _) ->

  API =

    getController: () ->
      new Provider.Controller()


  class Provider.Controller extends App.Controllers.Base

      # V2 of API
      baseURL: 'http://musicbrainz.org/ws/2/'

      # Max count
      maxCount: 1

      ## Make a call to API
      call: (path, params, callback) ->
        url = @baseURL + path + helpers.url.buildParams(params) + '&callback=?'
        $.get url, (resp) ->
          $xml = $(resp)
          callback($xml)

      ## Find an artist
      findArtist: (artist, callback) ->
        @call 'artist/', {query: 'artist:' + artist}, callback


  ## Find movie images via IMDb ID
  App.commands.setHandler "musicbrainz:artist:id", (name, callback) ->
    controller = API.getController()
    controller.findArtist name, ($xml) ->
      $artist = $xml.find('artist').first()
      if $artist.length > 0
        callback $artist.attr('id')
      else
        callback(false)

