@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['title', 'file', 'mimetype']
      small: ['thumbnail']
      full: ['fanart', 'streamdetails']
    addonFields: ['path', 'name']

    sources: [
      {media: 'video', label: 'Video', type: 'source', provides: 'video'}
      {media: 'music', label: 'Music', type: 'source', provides: 'audio'}
      {media: 'music', label: 'Audio Addons', type: 'addon', provides: 'audio', addonType: 'xbmc.addon.audio', content: 'unknown'}
      {media: 'video', label: 'Video Addons', type: 'addon', provides: 'files', addonType: 'xbmc.addon.video', content: 'unknown'}
    ]

    directorySeperator: '/'

    ## Fetch a single entity
    getEntity: (id, options) ->
      entity = new App.KodiEntities.File()
      entity.set({file: id, properties:  helpers.entities.getFields(API.fields, 'full')})
      entity.fetch options
      entity

    ## Fetch an entity collection.
    getCollection: (type, options) ->
      defaultOptions = {cache: true}
      options = _.extend defaultOptions, options
      if type is 'sources'
        collection = new KodiEntities.SourceCollection()
      else
        collection = new KodiEntities.FileCollection()
      collection.fetch options
      collection

    ## Split a collection into files and folders
    parseToFilesAndFolders: (collection) ->
      all = collection.getRawCollection()
      collections = {}
      collections.file = new KodiEntities.FileCustomCollection _.where(all, {filetype: 'file'})
      collections.directory = new KodiEntities.FileCustomCollection _.where(all, {filetype: 'directory'})
      collections

    ## Get a source media types, we don't use backbone.rpc because it's multiple
    ## calls seem really flakey on collections as it is geared towards models.
    ## This allows better parsing anyway as we can add the media to each model.
    ## We also parse in available addon sources.
    getSources: ->
      commander = App.request "command:kodi:controller", 'auto', 'Commander'
      commands = []
      collection = new KodiEntities.SourceCollection()
      for source in @sources
        if source.type is 'source'
          commands.push {method: 'Files.GetSources', params: [source.media]}
        if source.type is 'addon'
          commands.push {method: 'Addons.GetAddons', params: [source.addonType, source.content, true, @addonFields]}
      ## Parse the source response and create a collection
      commander.multipleCommands commands, (resp) =>
        for i, item of resp
          source = @sources[i]
          repsonseKey = source.type + 's'
          if item[repsonseKey]
            for model in item[repsonseKey]
              model.media = source.media
              model.sourcetype = source.type
              if source.type is 'addon'
                model.file = @createAddonFile model
                model.label = model.name
              model.url = @createFileUrl(source.media, model.file)
              collection.add model
        collection.trigger 'cachesync'
      collection

    ## Turn the full source collection into collection sets.
    parseSourceCollection: (collection) ->
      all = collection.getRawCollection()
      collection = []
      for source in @sources
        items = _.where(all, {media: source.media})
        if items.length > 0 and source.type is 'source'
          source.sources = new KodiEntities.SourceCollection items
          source.url = 'browser/' + source.media
          collection.push source
      new KodiEntities.SourceSetCollection collection

    ## Create a url for this file/folder
    createFileUrl: (media, file) ->
      'browser/' + media + '/' + helpers.global.hash('encode', file)

    ## Create a url for an addon
    createAddonFile: (addon) ->
      'plugin://' + addon.addonid

    ## Parse files for extra data
    parseFiles: (items, media) ->
      for i, item of items
        if not item.parsed
          item = App.request "images:path:entity", item
          items[i] = @correctFileType item
          items[i].media = media
          items[i].player = @getPlayer(media)
          items[i].url = @createFileUrl media, item.file
          items[i].parsed = true
      items

    ## The damn kodi api is returning folders with a filetype of 'file' !!??!
    ## So we do some extra checking and parsing to correct the filetype.
    ## TODO: follow up with montelese and topfs
    correctFileType: (item) ->
      directoryMimeTypes = ['x-directory/normal']
      if item.mimetype and helpers.global.inArray(item.mimetype, directoryMimeTypes)
        item.filetype = 'directory'
      item

    ## Parse a path and attempt to make a collection from it
    createPathCollection: (file, sourcesCollection) ->
      items = []
      parentSource = {}
      allSources = sourcesCollection.getRawCollection()
      for source in allSources
        if parentSource.file ## only match on the first found
          continue
        if helpers.global.stringStartsWith(source.file, file)
          parentSource = source
      if parentSource.file
        items.push parentSource
        basePath = parentSource.file
        pathParts = helpers.global.stringStripStartsWith(parentSource.file, file).split(@directorySeperator)
        for part in pathParts
          if part isnt ''
            basePath += part + @directorySeperator
            items.push @createPathModel(parentSource.media, part, basePath)
      new KodiEntities.FileCustomCollection items

    ## Create a model structure for a virtual path entity.
    createPathModel: (media, label, file) ->
      model =
        label: label
        file: file
        media: media
        url: @createFileUrl media, file
      console.log model
      model

    ## fix the naming discrepancy between files and the rest of the app :(
    getPlayer: (media) ->
      if media is 'music'
        'audio'
      media


  ###
   Models and collections.
  ###

  ## Single File model.
  class KodiEntities.EmptyFile extends App.KodiEntities.Model
    idAttribute: "file"
    defaults: ->
      fields = _.extend(@modelDefaults, {filetype: 'directory', media: '', label: '', url: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields

  ## Single File model.
  class KodiEntities.File extends KodiEntities.EmptyFile
    methods: read: ['Files.GetFileDetails', 'file', 'properties']
    parse: (resp, xhr) ->
      obj = if resp.filedetails? then resp.filedetails else resp
      if resp.filedetails?
        obj.fullyloaded = true
      obj

  ## Files collection
  class KodiEntities.FileCollection extends App.KodiEntities.Collection
    model: KodiEntities.File
    methods: read: ['Files.GetDirectory', 'arg1', 'arg2', 'arg3', 'arg4']
    arg1: -> @argCheckOption('file', '')
    arg2: -> @argCheckOption('media', '')
    arg3: -> helpers.entities.getFields(API.fields, 'small')
    arg4: -> @argSort("label", "ascending")
    parse: (resp, xhr) ->
      items = @getResult resp, 'files'
      API.parseFiles items, @options.media


  ## Files custom collection (for splitting into files and folders)
  class KodiEntities.FileCustomCollection extends App.KodiEntities.Collection
    model: KodiEntities.File

  ## Sources model.
  class KodiEntities.Source extends App.KodiEntities.Model
    idAttribute: "file"
    defaults:
      label: ''
      file: ''
      media: ''
      url: ''

  ## Files collection
  class KodiEntities.SourceCollection extends App.KodiEntities.Collection
    model: KodiEntities.Source


  ## Sources set model.
  class KodiEntities.SourceSet extends App.KodiEntities.Model
    idAttribute: "file"
    defaults:
      label: ''
      sources: ''

  ## Files collection
  class KodiEntities.SourceSetCollection extends App.KodiEntities.Collection
    model: KodiEntities.Source


  ###
   Request Handlers.
  ###

  # Get a single file
  App.reqres.setHandler "file:entity", (id, options = {}) ->
    API.getEntity id, options

  # Create a new file entity with info extracted from the url
  App.reqres.setHandler "file:url:entity", (media, hash) ->
    console.log hash, decodeURIComponent(hash)
    file = helpers.global.hash 'decode', hash
    new KodiEntities.EmptyFile {media: media, file: file, url: API.createFileUrl(media, file)}

  ## Get an file collection
  App.reqres.setHandler "file:entities", (options = {}) ->
    API.getCollection 'files', options

  # Get a path collection, requires a sources collection
  App.reqres.setHandler "file:path:entities", (file, sourceCollection) ->
    API.createPathCollection file, sourceCollection

  ## Get an file/directory collection
  App.reqres.setHandler "file:parsed:entities", (collection) ->
    API.parseToFilesAndFolders collection

  ## Get all sources.
  App.reqres.setHandler "file:source:entities", (media) ->
    API.getSources()

  ## Create a new source sub collection sources.
  App.reqres.setHandler "file:source:media:entities", (collection) ->
    API.parseSourceCollection collection

  ## Get a source media types
  App.reqres.setHandler "file:source:mediatypes", ->
    API.availableSources
