@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['title']
      small: ['thumbnail', 'playcount', 'lastplayed', 'dateadded', 'episode', 'rating', 'year', 'file', 'genre', 'watchedepisodes', 'cast', 'studio', 'mpaa']
      full: ['fanart', 'imdbnumber', 'episodeguide', 'plot', 'tag']

    ## Fetch a single entity
    getEntity: (id, options) ->
      entity = new App.KodiEntities.TVShow()
      entity.set({tvshowid: parseInt(id), properties:  helpers.entities.getFields(API.fields, 'full')})
      entity.fetch options
      entity

    ## Fetch an entity collection.
    getCollection: (options) ->
      defaultOptions = {cache: true, expires: config.get('static', 'collectionCacheExpiry'), useNamedParameters: true}
      options = _.extend defaultOptions, options
      collection = new KodiEntities.TVShowCollection()
      collection.fetch options
      collection

  ###
   Models and collections.
  ###

  ## Single TVShows model.
  class KodiEntities.TVShow extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {tvshowid: 1, tvshow: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    methods: read: ['VideoLibrary.GetTVShowDetails', 'tvshowid', 'properties']
    parse: (resp, xhr) ->
      obj = if resp.tvshowdetails? then resp.tvshowdetails else resp
      if resp.tvshowdetails?
        obj.fullyloaded = true
      obj.unwatched = obj.episode - obj.watchedepisodes
      @parseModel 'tvshow', obj, obj.tvshowid

  ## TVShowss collection
  class KodiEntities.TVShowCollection extends App.KodiEntities.Collection
    model: KodiEntities.TVShow
    methods: read: ['VideoLibrary.GetTVShows', 'properties', 'limits', 'sort', 'filter']
    args: -> @getArgs({
      properties: @argFields(helpers.entities.getFields(API.fields, 'small'))
      limits: @argLimit()
      sort: @argSort('title', 'ascending')
      filter: @argFilter()
    })
    parse: (resp, xhr) -> @getResult resp, 'tvshows'

  ###
   Request Handlers.
  ###

  # Get a single tvshow
  App.reqres.setHandler "tvshow:entity", (id, options = {}) ->
    API.getEntity id, options

  ## Get an tvshow collection
  App.reqres.setHandler "tvshow:entities", (options = {}) ->
    API.getCollection options

  ## Get a search collection
  App.commands.setHandler "tvshow:search:entities", (query, limit, callback) ->
    collection = API.getCollection {}
    App.execute "when:entity:fetched", collection, =>
      filtered = new App.Entities.Filtered(collection)
      filtered.filterByString('label', query)
      if callback
        callback filtered