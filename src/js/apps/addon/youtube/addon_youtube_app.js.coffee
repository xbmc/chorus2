@Kodi.module "AddonApp.YouTube", (Soundcloud, App, Backbone, Marionette, $, _) ->

  API =

    addonId: 'plugin.video.youtube'

    searchAddon:
      url: 'plugin://plugin.video.youtube/search/?q=[QUERY]'
      title: 'YouTube'
      media: 'video'

  ## Provide search settings
  App.reqres.setHandler "addon:search:settings:" + API.addonId, ->
    API.searchAddon

  ##
  ## Get any excluded paths that should not appear in breadcrumbs.
  ##
  ## Called via App.request("addon:excludedPaths", addonId)
  ##
  ## Eg. the youtube path "special" and "kodion" is used but both are
  ## invalid paths when requesting that url, yet they appear in breadcrumbs
  ## because they are part of the base url for other pages.
  ##
  ## Note the naming convention of the handler has the plugin id in it.
  ##
  App.reqres.setHandler "addon:excludedPaths:" + API.addonId, ->
    [
      'plugin://plugin.video.youtube/special/',
      'plugin://plugin.video.youtube/kodion/search/',
      'plugin://plugin.video.youtube/kodion/',
      'plugin://plugin.video.youtube/channel/',
    ]
