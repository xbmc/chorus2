###
  Our generic global helpers so we dont have add complexity to our app.
###
helpers.global = {}


## Shuffle an array.
helpers.global.shuffle = (array) ->
  i = array.length - 1
  while i > 0
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
    i--
  array


## Get a random number within a range.
helpers.global.getRandomInt = (min, max) ->
  Math.floor(Math.random() * (max - min + 1)) + min


## Get a timestamp in seconds
helpers.global.time = ->
  timestamp = new Date().getTime()
  timestamp / 1000;


## Boolean check for a needle in a haystack (like php in_array)
helpers.global.inArray = (needle, haystack) ->
  _.indexOf(haystack, needle) > -1


## Set loading state
helpers.global.loading = (state = 'start') =>
  op = if state is 'start' then 'add' else 'remove'
  if @Kodi?
    @Kodi.execute "body:state", op, "loading"


## Format a number with the desired number of leading zeros
helpers.global.numPad = (num, size) ->
  s = "000000000" + num
  s.substr s.length - size


## Convert seconds to time
helpers.global.secToTime = (totalSec = 0) ->
  totalSec = Math.round(totalSec)
  hours = parseInt(totalSec / 3600) % 24
  minutes = parseInt(totalSec / 60) % 60
  seconds = totalSec % 60
  hours: hours
  minutes: minutes
  seconds: seconds


## Convert time to seconds
helpers.global.timeToSec = (time) ->
  hours = parseInt(time.hours) * (60 * 60)
  minutes = parseInt(time.minutes) * 60
  parseInt(hours) + parseInt(minutes) + parseInt(time.seconds)


## format a nowplaying time object for display
helpers.global.formatTime = (time) ->
  if not time?
    0
  else
    timeStr = ((if time.hours > 0 then time.hours + ":" else "")) +
    ((if time.hours > 0 and time.minutes < 10 then "0" else "")) +
    ((if time.minutes > 0 then time.minutes + ":" else "")) +
    ((if (time.minutes > 0 or time.hours > 0) and time.seconds < 10 then "0" else "")) +
    time.seconds
    timeStr


## Basic helper that returns a new object with a key/value set
helpers.global.paramObj = (key, value) ->
  obj = {}
  obj[key] = value
  obj


## Check if a string starts with a given string
helpers.global.stringStartsWith = (start, data) ->
  new RegExp('^' + start).test(data)


## Strip a string from the begining of another string
helpers.global.stringStripStartsWith = (start, data) ->
  data.substring(start.length)


## Used for url stubs so we can pass long strings like files and folders
## via a url. op = 'encode' or 'decode'. value is the thing you want to encode/decode
## @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
helpers.global.hash = (op, value) ->
  if op is 'encode'
    encodeURIComponent(value)
  else
    decodeURIComponent(value)


## Round the rating
helpers.global.rating = (rating) ->
  Math.round(rating * 10) / 10

## Set the title
helpers.global.appTitle = (playingItem = false) ->
  titlePrefix = ''
  if _.isObject(playingItem) and playingItem.label?
    titlePrefix = '▶ ' + playingItem.label + ' | '
  document.title = titlePrefix + config.get('static', 'appTitle')

## Open the local video player window
helpers.global.localVideoPopup = (path, height = 545) ->
  window.open(path, "_blank", "toolbar=no, scrollbars=no, resizable=yes, width=925, height=#{height}, top=100, left=100");

## Strip tags from a string
helpers.global.stripTags = (string) ->
  string.replace(/(<([^>]+)>)/ig,"");