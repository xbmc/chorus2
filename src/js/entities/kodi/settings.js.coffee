@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    settingsLevel: "standard"

    settingsType:
      sections: "SettingSectionCollection"
      categories: "SettingCategoryCollection"
      settings: "SettingCollection"

    fields:
      minimal: ['settingstype']
      small: ['title', 'control', 'options', 'parent', 'enabled', 'type', 'value', 'enabled', 'default', 'help', 'path', 'description', 'section', 'category']
      full: []

    getSettingsLevel: ->
      @settingsLevel

    ## Fetch a single entity
    getEntity: (id, collection) ->
      model = collection.where({method: id}).shift()
      model

    ## Fetch an entity collection.
    getCollection: (options = {type: 'sections'}) ->
      collectionMethod = @settingsType[options.type]
      collection = new KodiEntities[collectionMethod]()
      collection.fetch options
      if options.section and options.type is 'settings'
        collection.where {section: options.section}
      collection

    getSettings: (section, categories = [], callback) ->
      commander = App.request "command:kodi:controller", 'auto', 'Commander'
      commands = []
      items = []
      $(categories).each (i, category) =>
        commands.push {method: 'Settings.GetSettings', params: [@getSettingsLevel(), {"section": section, "category": category}]}
      commander.multipleCommands commands, (resp) =>
        for i, item of resp
          catId = categories[i]
          items[catId] = @parseCollection(item.settings, 'settings')
        callback(items)

    # Parse response items before creating collection.
    parseCollection: (itemsRaw = [], type = 'settings') ->
      items = []
      for method, item of itemsRaw
        items.push @parseItem(item, type)
      items

    parseItem: (item, type = 'settings') ->
      item.settingstype = type
      item.title = item.label
      item.description = item.help
      item.path = 'settings/kodi/'
      switch type
        when 'sections'
          item.path += item.id
        when 'categories'
          item.path += helpers.url.arg(2) + '/' + item.id
        else
          ## nothing
      item

    # Save a collection of settings (values from settings forms)
    saveSettings: (data, callback) ->
      commander = App.request "command:kodi:controller", 'auto', 'Commander'
      commands = []
      for key, val of data
        commands.push {method: 'Settings.SetSettingValue', params: [key, @valuePreSave(val)]}
      commander.multipleCommands commands, (resp) =>
        if callback
          callback resp

    # Final parsing before save
    valuePreSave: (val) ->
      # If int, cast as int
      if val is String(parseInt(val))
        val = parseInt(val)
      val

  ###
   Models and collections.
  ###

  ## Single API Setting model.
  class KodiEntities.Setting extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {id: 0, params: {}})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'small'), fields

  ## Sections collection
  class KodiEntities.SettingSectionCollection extends App.KodiEntities.Collection
    model: KodiEntities.Setting
    methods: read: ['Settings.GetSections']
    parse: (resp, xhr) ->
      items = @getResult resp, @options.type
      API.parseCollection items, @options.type

  ## Categories collection
  class KodiEntities.SettingCategoryCollection extends App.KodiEntities.Collection
    model: KodiEntities.Setting
    methods: read: ['Settings.GetCategories', 'arg1', 'arg2']
    arg1: -> API.getSettingsLevel()
    arg2: ->
      @argCheckOption('section', 0)
    parse: (resp, xhr) ->
      items = @getResult resp, @options.type
      API.parseCollection items, @options.type

  ## Setting collection
  class KodiEntities.SettingCollection extends App.KodiEntities.Collection
    model: KodiEntities.Setting
    methods: read: ['Settings.GetSettings', 'arg1']
    arg1: -> API.getSettingsLevel()
    parse: (resp, xhr) ->
      items = @getResult resp, @options.type
      API.parseCollection items, @options.type

  ## Setting filtered collection
  class KodiEntities.SettingFilteredCollection extends App.KodiEntities.SettingCollection
    methods: read: ['Settings.GetSettings', 'arg1', 'arg2']
    arg2: -> {
      section: @argCheckOption('section', 0)
      category: @argCheckOption('category', 0)
    }


  ###
   Request Handlers.
  ###

  ## Get a list of settings
  App.reqres.setHandler "settings:kodi:entities", (options = {}) ->
    API.getCollection options

  ## Get a filtered list of settings for a section
  App.reqres.setHandler "settings:kodi:filtered:entities", (options = {}) ->
    API.getSettings options.section, options.categories, (items) ->
      options.callback(items)

  ## Save an object of settings
  App.commands.setHandler "settings:kodi:save:entities", (data= {}, callback) ->
    API.saveSettings data, callback

