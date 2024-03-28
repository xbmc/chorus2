/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  For everything translatable.
*/

helpers.translate = {};

//# When a new language file (src/lang/*.po) is added, it must also be added
//# here as an available option.
helpers.translate.getLanguages = () => ({
  af: "Afrikaans (South Africa)",
  am: "Amharic (Ethiopia)",
  ar: "Arabic (Saudi Arabia)",
  ast: "Asturian (Spain)",
  az: "Azerbaijani",
  be: "Belarusian",
  bg: "Bulgarian",
  bs: "Bosnian",
  ca: "Catalan (Spain)",
  cs: "Czech",
  cy: "Welsh (United Kingdom)",
  da: "Danish",
  de: "German",
  el: "Greek",
  en: "English (United Kingdom)",
  en_au: "English (Australia)",
  en_nz: "English (New Zealand)",
  en_us: "English (United States)",
  eo: "Esperanto",
  es: "Spanish (Spain)",
  es_ar: "Spanish (Argentina)",
  es_mx: "Spanish (Mexico)",
  et: "Estonian",
  eu: "Basque (Spain)",
  fa: "Persian (Afghanistan)",
  fa_ir: "Persian (Iran)",
  fi: "Finnish",
  fo: "Faroese",
  fr: "French (France)",
  fr_ca: "French (Canada)",
  gl: "Galician (Spain)",
  he: "Hebrew (Israel)",
  hi: "Hindi (India)",
  hr: "Croatian",
  hu: "Hungarian",
  hy: "Armenian",
  id: "Indonesian",
  is: "Icelandic",
  it: "Italian",
  ja: "Japanese",
  kn: "Kannada (India)",
  ko: "Korean",
  lt: "Lithuanian",
  lv: "Latvian",
  mi: "Maori",
  mk: "Macedonian",
  ml: "Malayalam (India)",
  mn: "Mongolian",
  ms: "Malay",
  mt: "Maltese",
  my: "Burmese",
  nb: "Norwegian",
  nl: "Dutch",
  pl: "Polish",
  pt: "Portuguese (Portugal)",
  pt_br: "Portuguese (Brazil)",
  ro: "Romanian",
  ru: "Russian",
  si: "Sinhala (Sri Lanka)",
  sk: "Slovak",
  sl: "Slovenian",
  sq: "Albanian",
  sr: "Serbian",
  "sr_rs@latin": "Serbian (latin)",
  sv: "Swedish",
  szl: "Silesian",
  ta: "Tamil (India)",
  te: "Telugu (India)",
  tg: "Tajik",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  uz: "Uzbek",
  vi: "Vietnamese",
  zh_cn: "Chinese (Simplified)",
  zh_tw: "Chinese (Traditional)"
});

//# Init language and translations.
helpers.translate.init = function(callback) {

  const defaultLang = config.get("static", "lang", "en");

  // Need to get the language key from local storage before the app has started
  // so this does a workaround to grab it direct from local storage.
  const lang = config.preStartGet("lang", defaultLang);

  // Load the correct language from settings.
  return $.getJSON("lang/_strings/" + lang + ".json", function(data) {
    window.t = new Jed(data);
    // If a key is missing, throw a console error.
    t.options["missing_key_callback"] = key => helpers.translate.missingKeyLog(key);
    // Do whatever needs to be done after language is ready (eg. start the app)
    return callback();
  });
};

//# Format a missing key in a .po format so it can be
//# easily added.
helpers.translate.missingKeyLog = function(key) {
  const item = '\n\n' +
         'msgctxt ""\n' +
         'msgid "' + key + '"\n' +
         'msgstr "' + key + '"\n';
  return helpers.debug.msg(item, 'warning');
};

/*
  Translate aliases.
*/
const tr = text => t.gettext(text);
