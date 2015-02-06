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