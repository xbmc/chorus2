###
  Entity Helpers
###
helpers.entities = {}

# Create a UniqueID (uid) from a model object (raw)
# Numerical id is the preference, fallback to file
helpers.entities.createUid = (model, type) ->
  type = if type then type else model.type
  id = model.id
  uid = 'none'
  if typeof id is 'number' or type is 'season'
    uid = id
  else
    file = model.file
    if file
      hash = helpers.global.hashEncode(file)
      uid = 'path-' + hash.substring 0, 26
  # Return pre-pending th type
  type + '-' + uid


## Get fields for an entity given the set and type.
helpers.entities.getFields = (set, type = 'small') ->
  if not _.isObject(set) or not set[type]
    []
  fields = set.minimal
  if type is 'full'
    fields.concat(set.small).concat(set.full)
  else if type is 'small'
    fields.concat(set.small)
  else
    fields

## Build a subtitle based on the content.
helpers.entities.getSubtitle = (model) ->
  subtitle = ''
  switch model.type
    when 'song'
      if model.artist
        subtitle = model.artist.join(',')
    else
      subtitle = ''
  subtitle

## Basic link to entity
helpers.entities.playingLink = (model) ->
  "<a href='##{model.url}'>#{model.label}</a>"

## Is watched
helpers.entities.isWatched = (model) ->
  watched = false
  if model? and model.get('playcount')
    watched = if model.get('playcount') > 0 then true else false
  watched

# Set progress on an entity.
helpers.entities.setProgress = ($el, progress) ->
  progress = progress + '%'
  $el.find('.current-progress').css('width', progress).attr('title', progress + ' ' + t.gettext('complete'))

## Get default options
helpers.entities.buildOptions = (options) ->
  defaultOptions = {useNamedParameters: true}
  # Only cache if we are not using filters.
  if not options.filter
    defaultOptions.cache = true
    defaultOptions.expires = config.get('static', 'collectionCacheExpiry')
  _.extend defaultOptions, options

## Returns the Chorus search menu items for local and addon search.
helpers.entities.getAddonSearchMenuItems = (query) ->
  addonSearches = Kodi.request "addon:search:enabled"
  ret = '<li data-type="all" data-query="' + query + '">' + tr('Local media') + '</li>'
  if addonSearches.length > 0
    ret += '<li class="divider"></li>'
    for addonSearch in addonSearches
      ret += '<li data-type="' + addonSearch.id + '" data-query="' + query + '">' +  tr(addonSearch.title)+ '</li>'
  ret

## Wrapper for refreshing an entity. As a refresh removes the ID we need to wrap a bunch of extra logic around it.
## ie: Show a confirm box, a few seconds after confirm, search for entity with the same title and redirect to the id
## if we are on the same page AND deal with cache and thumbs up which both use IDs
## This is NOT robust and overly complex! but should work 95% of the time.
helpers.entities.refreshEntity = (model, controller, method, params = {}) ->
  title = model.get('label')
  type = model.get('type')
  originalPath = model.get('url')
  refreshTimeout = if type is 'tvshow' then 10000 else 3000
  baseUrl = model.get('url').split('/').slice(0,-1).join('/')
  thumbs = Kodi.request "thumbsup:check", model
  params.ignorenfo = config.getLocal 'refreshIgnoreNFO', true
  # Show confirm box
  Kodi.execute "ui:modal:confirm", tr('Are you sure?'), t.sprintf(tr('Confirm refresh'), title), () ->
    # Clear model from cache and remove thumbs up
    Backbone.fetchCache.clearItem(model)
    if thumbs
      Kodi.request "thumbsup:toggle:entity", model
    # Do the refresh using the provided controller/method.
    controller[method] model.get('id'), params, (resp) ->
      Kodi.execute "notification:show", tr("Refreshed media. Additional updates may still be occurring in the background")
      # After a few seconds, search by title to try and get a new id, then refresh. Fallback to search page
      setTimeout(() ->
        # Episodes redirect to season as might not have a lookup title
        if title
          opts =
            limits: {start: 0, end: 1}
            filter: {'operator': 'is', 'field': 'title', 'value': title}
            sort: {method: 'none', order: 'descending'}
            success: (collection) ->
              if collection.length
                newModel = collection.first()
                if thumbs
                  Kodi.request "thumbsup:toggle:entity", newModel
                if originalPath is helpers.url.path()
                  Kodi.navigate baseUrl + "/" + newModel.get('id'), {trigger: true}
              else
                Kodi.execute "notification:show", tr("Refreshed media not found, redirecting to search")
                Kodi.navigate "search/" + type + "/" + title, {trigger: true}
          Kodi.request(type + ":entities", opts)
      , refreshTimeout)
