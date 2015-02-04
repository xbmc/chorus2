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


## Get url args
helpers.url.arg = (arg = 'none') ->
  hash = location.hash
  args = hash.substring(1).split('/')
  if arg is 'none'
    args
  else if args[arg]?
    args[arg]
  else
    ''


## Get Url params
## Will automatically parse current url or the params provided eg. 'foo=bar&duck=sauce'
helpers.url.params = (params = 'auto') ->
  if params is 'auto'
    p = document.location.href
    if p.indexOf('?') is -1
      return {}
    else
      [path, query] = p.split('?')
  query ?= params
  _.object _.compact _.map query.split('&'), (item) -> if item then item.split '='


## Get a query params string ready for appending to a url
helpers.url.buildParams = (params) ->
  q = []
  for key, val of params
    q.push key + '=' + encodeURIComponent(val)
  '?' + q.join('&')


## Alter the params by suppling options to add or remove
## Add is an object with key: val pairs, Remove is an array of keys to remove.
## Returns a full url path (no # symbol)
helpers.url.alterParams = (add = {}, remove = []) ->
  curParams = helpers.url.params()
  if remove.length > 0
    for k in remove
      delete curParams[k]
  params = _.extend curParams, add
  helpers.url.path() + helpers.url.buildParams(params)


## Get the current path.
helpers.url.path = ->
  p = document.location.hash
  [path, query] = p.split('?')
  path.substring(1)