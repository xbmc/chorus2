###
  For everything translatable.
###

helpers.translate = {}

## When a new language file (src/lang/*.po) is added, it must also be added
## here as an available option.
helpers.translate.getLanguages = ->
  {
    en: "English"
    gr: "German"
    fr: "French"
  }

## Init language and translations.
helpers.translate.init = (callback) ->

  # Need to get the language key from local storage before the app has started
  # so this does a workaround to grab it direct from local storage.
  # TODO Find a better way to do this!
  lang = config.get "static", "lang", "en"
  if localStorage? and localStorage.getItem('config:app-config:local')?
    lang = JSON.parse(localStorage.getItem('config:app-config:local')).data.lang

  # Load the correct language from settings.
  $.getJSON "lang/" + lang + ".json", (data) ->
    window.t = new Jed(data)
    # If a key is missing, throw a console error.
    t.options["missing_key_callback"] = (key) -> console.error key
    # Do whatever needs to be done after language is ready (eg. start the app)
    callback()
