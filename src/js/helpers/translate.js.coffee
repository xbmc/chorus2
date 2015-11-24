###
  For everything translatable.
###

helpers.translate = {}

## When a new language file (src/lang/*.po) is added, it must also be added
## here as an available option.
helpers.translate.getLanguages = ->
  {
    en: "English"
    fr: "French"
    de: "German"
    nl: "Dutch"
  }

## Init language and translations.
helpers.translate.init = (callback) ->

  defaultLang = config.get "static", "lang", "en"

  # Need to get the language key from local storage before the app has started
  # so this does a workaround to grab it direct from local storage.
  lang = config.preStartGet "lang", defaultLang

  # Load the correct language from settings.
  $.getJSON "lang/_strings/" + lang + ".json", (data) ->
    window.t = new Jed(data)
    # If a key is missing, throw a console error.
    t.options["missing_key_callback"] = (key) -> helpers.translate.missingKeyLog key
    # Do whatever needs to be done after language is ready (eg. start the app)
    callback()

## Format a missing key in a .po format so it can be
## easily added.
helpers.translate.missingKeyLog = (key) ->
  item = '\n\n' +
         'msgctxt ""\n' +
         'msgid "' + key + '"\n' +
         'msgstr "' + key + '"\n'
  helpers.debug.msg item, 'warning'
