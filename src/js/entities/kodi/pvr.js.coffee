@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['thumbnail']
      small: ['channeltype', 'hidden', 'locked', 'channel', 'lastplayed', 'broadcastnow']
      full: []

    ## Fetch a single entity, requires a channel collection passed.
    getEntity: (collection, channel) ->
      collection.findWhere({channel: channel})

    ## Fetch an entity collection.
    getCollection: (options) ->
      defaultOptions = {useNamedParameters: true}
      options = _.extend defaultOptions, options
      collection = new KodiEntities.ChannelCollection()
      collection.fetch options
      collection

  ###
   Models and collections.
  ###

  ## Single Channel model.
  class KodiEntities.Channel extends App.KodiEntities.Model
    defaults: ->
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), {}
    parse: (obj, xhr) ->
      obj.fullyloaded = true
      @parseModel 'channel', obj, obj.channelid

  ## Channel collection
  class KodiEntities.ChannelCollection extends App.KodiEntities.Collection
    model: KodiEntities.Channel
    methods: read: ['PVR.GetChannels', 'channelgroupid', 'properties', 'limits']
    args: -> @getArgs({
      channelgroupid: @argCheckOption('group', 0)
      properties: helpers.entities.getFields(API.fields, 'small')
      limits: @argLimit()
    })
    parse: (resp, xhr) ->
      @getResult resp, 'channels'

  ###
   Request Handlers.
  ###

  # Get a single channel
  App.reqres.setHandler "channel:entity", (collection, channel) ->
    API.getEntity collection, channel,

  ## Get an channel collection
  App.reqres.setHandler "channel:entities", (group = 'alltv', options = {}) ->
    options.group = group
    API.getCollection options
