###
  A collection of small jquery plugin helpers.
###


# Remove a class matching a regex
# http://stackoverflow.com/a/18621161
## usage: $('#hello').removeClassRegex(/^color-/)
$.fn.removeClassRegex = (regex) ->
  $(@).removeClass (index, classes) ->
    classes.split(/\s+/).filter (c) ->
      regex.test c
    .join ' '

## Remove classes starting with...
$.fn.removeClassStartsWith = (startsWith) ->
  regex = new RegExp('^' + startsWith, 'g');
  $(@).removeClassRegex(regex)

## On scoll stop
## http://stackoverflow.com/a/14035162
$.fn.scrollStopped = (callback) ->
  $this = $(this)
  self = this
  $this.scroll ->
    if $this.data('scrollTimeout')
      clearTimeout $this.data('scrollTimeout')
    $this.data 'scrollTimeout', setTimeout(callback, 250, self)

## On resize stop
$.fn.resizeStopped = (callback) ->
  $this = $(this)
  self = this
  $this.resize ->
    if $this.data('resizeTimeout')
      clearTimeout $this.data('resizeTimeout')
    $this.data 'resizeTimeout', setTimeout(callback, 250, self)