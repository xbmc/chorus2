@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['thumbnail']
      small: ['channeltype', 'hidden', 'locked', 'channel', 'lastplayed']
      full: []

    ## Fetch a single entity, requires a channel collection passed.
    getEntity: (collection, channel) ->
      collection.findWhere({channel: channel})

    ## Fetch an entity collection.
    getCollection: (options) ->
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
    methods: read: ['PVR.GetChannels', 'arg1', 'arg2', 'arg3']
    arg1: ->@argCheckOption('group', 0)
    arg2: -> helpers.entities.getFields(API.fields, 'small')
    arg3: -> @argLimit()
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
