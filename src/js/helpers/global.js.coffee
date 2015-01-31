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