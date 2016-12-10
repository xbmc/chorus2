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
  if typeof id is 'number'
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
  fields = set.minimal
  if type is 'full'
    fields.concat(set.small).concat(set.full)
  else if type is 'small'
    fields.concat(set.small)
  else
    fields

## Build a subtitle based on the content.
helpers.entities.getSubtitle = (model) ->
  switch model.type
    when 'song'
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
