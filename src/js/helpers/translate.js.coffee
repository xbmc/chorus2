###
  For everything translatable.
###

helpers.translate = {}

helpers.translate.getLanguages = (callback) ->
  returnVal = ''
  $.getJSON 'resources/language/manifest.json', (data) ->
    _.each data, (lang) ->
      returnVal += '"' + lang.lang + '": "' + lang.name + '",'
    callback JSON.parse '{' + (returnVal.slice 0, -1) + '}'

helpers.translate.init = (callback) ->
  $.getJSON("resources/language/" + config.static.lang + ".json", (data) -> 
    window.t = new Jed(data)
    t.options["missing_key_callback"] = (key) -> console.error key
  )