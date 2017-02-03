@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fieldsChannel:
      minimal: ['thumbnail']
      small: ['channeltype', 'hidden', 'locked', 'channel', 'lastplayed', 'broadcastnow', 'isrecording']
      full: []

    fieldsRecording:
      minimal: ['channel', 'file', 'title']
      small: ['resume', 'plot', 'genre', 'playcount', 'starttime', 'endtime', 'runtime', 'icon', 'art', 'streamurl', 'directory', 'radio', 'isdeleted', 'channeluid']
      full: []


    ## Fetch a single channel entity
    getChannelEntity: (id, options = {}) ->
      entity = new App.KodiEntities.Channel()
      entity.set({channelid: parseInt(id), properties: helpers.entities.getFields(API.fieldsChannel, 'full')})
      entity.fetch options
      entity

    ## Fetch an channel entity collection.
    getChannelCollection: (options) ->
      defaultOptions = {useNamedParameters: true}
      options = _.extend defaultOptions, options
      collection = new KodiEntities.ChannelCollection()
      collection.fetch options
      collection

    ## Fetch a single recording entity
    getRecordingEntity: (id, options = {}) ->
      entity = new App.KodiEntities.Recording()
      entity.set({recordingid: parseInt(id), properties: helpers.entities.getFields(API.fieldsRecording, 'full')})
      entity.fetch options
      entity

    ## Fetch an recording entity collection.
    getRecordingCollection: (options) ->
      defaultOptions = {useNamedParameters: true}
      options = _.extend defaultOptions, options
      collection = new KodiEntities.RecordingCollection()
      collection.fetch options
      collection


  ###
   Models and collections.
  ###

  ## Single Channel model
  class KodiEntities.Channel extends App.KodiEntities.Model
    defaults: ->
      @parseFieldsToDefaults helpers.entities.getFields(API.fieldsChannel, 'full'), {}
    methods: read: ['PVR.GetChannelDetails', 'channelid', 'properties']
    parse: (resp, xhr) ->
      obj = if resp.channeldetails? then resp.channeldetails else resp
      if resp.channeldetails?
        obj.fullyloaded = true
      @parseModel 'channel', obj, obj.channelid

  ## Channel collection
  class KodiEntities.ChannelCollection extends App.KodiEntities.Collection
    model: KodiEntities.Channel
    methods: read: ['PVR.GetChannels', 'channelgroupid', 'properties', 'limits']
    args: -> @getArgs
      channelgroupid: @argCheckOption('group', 0)
      properties: helpers.entities.getFields(API.fieldsChannel, 'small')
      limits: @argLimit()
    parse: (resp, xhr) ->
      @getResult resp, 'channels'


  ## Recording model
  class KodiEntities.Recording extends App.KodiEntities.Model
    defaults: ->
      @parseFieldsToDefaults helpers.entities.getFields(API.fieldsRecording, 'full'), {}
    methods: read: ['PVR.GetRecordingDetails', 'recordingid', 'properties']
    parse: (obj, xhr) ->
      obj.fullyloaded = true
      obj.player = if obj.radio then 'audio' else 'video'
      @parseModel 'recording', obj, obj.recordingid

  ## Recording collection
  class KodiEntities.RecordingCollection extends App.KodiEntities.Collection
    model: KodiEntities.Recording
    methods: read: ['PVR.GetRecordings', 'properties', 'limits']
    args: -> @getArgs
      properties: helpers.entities.getFields(API.fieldsRecording, 'small')
      limits: @argLimit()
    parse: (resp, xhr) ->
      @getResult resp, 'recordings'


  ###
   Request Handlers.
  ###

  # Get a single channel
  App.reqres.setHandler "channel:entity", (channelid, options = {}) ->
    API.getChannelEntity channelid, options

  ## Get an channel collection
  App.reqres.setHandler "channel:entities", (group = 'alltv', options = {}) ->
    options.group = group
    API.getChannelCollection options

  # Get a single recording
  App.reqres.setHandler "recording:entity", (channelid, options = {}) ->
    API.getRecordingEntity channelid, options

  ## Get an recording collection
  App.reqres.setHandler "recording:entities", (group = 'alltv', options = {}) ->
    options.group = group
    API.getRecordingCollection options