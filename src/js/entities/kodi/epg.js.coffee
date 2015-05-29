@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: []
      small: ['title', 'runtime', 'starttime', 'endtime', 'genre']
      full: ['plot', 'progress', 'progresspercentage' ,'episodename', 'episodenum', 'episodepart','firstaired', 'hastimer', 'isactive', 'parentalrating','wasactive', 'thumbnail']

    ## Fetch a single entity, requires a channel collection passed.
    ###getEntity: (collection, channel) ->
      collection.findWhere({channel: channel})###

    ## Fetch a single entity
    getEntity: (channelid, options) ->
      entity = new App.KodiEntities.Broadcast()
      entity.set({channelid: parseInt(channelid), properties:  helpers.entities.getFields(API.fields, 'full')})
      entity.fetch options
      entity

    ## Fetch an entity collection.
    getCollection: (options) ->
      collection = new KodiEntities.BroadcastCollection()
      collection.fetch options
      collection


  ###
   Models and collections.
  ###

  ## Single Channel model.
  class KodiEntities.Broadcast extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {channelid: 1, channel: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    methods: read: ['PVR.GetBroadcasts', 'channelid', 'properties']
    parse: (resp, xhr) ->
      obj = if resp.broadcasts? then resp.broadcasts else resp
      if resp.broadcasts?
        obj.fullyloaded = true
      @parseModel 'broadcast', obj, obj.channelid
    ###defaults: ->
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), {}
    parse: (obj, xhr) ->
      obj.fullyloaded = true
      @parseModel 'broadcast', obj, obj.channelid###

  ## Channel collection
  class KodiEntities.BroadcastCollection extends App.KodiEntities.Collection
    model: KodiEntities.Broadcast
    methods: read: ['PVR.GetBroadcasts', 'arg1', 'arg2', 'arg3']
    arg1: -> parseInt @argCheckOption('channelid', 0)
    arg2: -> helpers.entities.getFields(API.fields, 'full')
    arg3: -> @argLimit()
    parse: (resp, xhr) ->
      @getResult resp, 'broadcasts'


  ###
   Request Handlers.
  ###

  # Get a single channel
  App.reqres.setHandler "broadcast:entity", (collection, channelid) ->
    API.getEntity collection, channelid,

  ## Get an channel collection
  App.reqres.setHandler "broadcast:entities", (channelid, options = {}) ->
    options.channelid = channelid
    API.getCollection options
