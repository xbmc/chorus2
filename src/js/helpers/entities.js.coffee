###
  Entity Helpers
###
helpers.entities = {}

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

helpers.entities.playingLink = (model) ->
  "<a href='##{model.url}'>#{model.label}</a>"