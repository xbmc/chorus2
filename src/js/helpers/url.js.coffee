###
  Handle urls.
###
helpers.url = {}

## Map generic entities to their urls.
helpers.url.map =
  artist: 'music/artist/:id'
  album: 'music/album/:id'
  song: 'music/song/:id'
  movie: 'movie/:id'
  tvshow: 'tvshow/:id'
  tvseason: 'tvshow/:tvshowid/:id'
  tvepisode: 'tvshow/:tvshowid/:tvseason/:id'
  file: 'browser/file/:id'

## Get a url for a given model type.
helpers.url.get = (type, id = '', replacements = {}) ->
  ## Get the path from the map
  path = ''
  if helpers.url.map[type]?
    path = helpers.url.map[type]
  ## Replace the tokens in the path
  replacements[':id'] = id
  for token, id of replacements
    path = path.replace(token, id)
  path