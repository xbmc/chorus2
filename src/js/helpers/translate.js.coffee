###
  For everything translatable.
###

helpers.translate = {}

helpers.translate.getLanguages = (callback) ->
  returnVal = ''
  $.getJSON 'resources/language/manifest.json', (data) ->
    _.each data, (lang) ->
      returnVal += lang.lang + ': "' + lang.name + '", '
    callback returnVal
