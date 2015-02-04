###
  A collection of small jquery plugin helpers.
###


# Remove a class matching a regex
$.fn.removeClassRegex = (regex) ->
  $(@).removeClass (index, classes) ->
    classes.split(/\s+/).filter (c) ->
      regex.test c
    .join ' '