###
  Stream helpers
###
helpers.stream = {}


###
  Maps.
###


## Map for video stream sizes
helpers.stream.videoSizeMap = [
    {
      min: 0
      max: 360
      label: 'SD'
    }
    {
      min: 361
      max: 480
      label: '480'
    }
    {
      min: 481
      max: 576
      label: '576'
    }
    {
      min: 577
      max: 720
      label: '720p'
    }
    {
      min: 721
      max: 1080
      label: '1080p'
    }
    {
      min: 1081
      max: 100000
      label: '4K'
    }
  ]

## Map for audio channels
helpers.stream.audioChannelMap = [
    {
      channels: 6
      label: '5.1'
    },
    {
      channels:7
      label: '6.1'
    }
    {
      channels: 8
      label: '7.1'
    }
    {
      channels: 2
      label: '2.1'
    }
    {
      channels: 1
      label: 'mono'
    }
  ]

## Map for language codes (using https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes Set 2/B)
helpers.stream.langMap =
  'und': 'Unknown'
  'aar': 'Afar'
  'abk': 'Abkhazian'
  'afr': 'Afrikaans'
  'aka': 'Akan'
  'alb': 'Albanian'
  'amh': 'Amharic'
  'ara': 'Arabic'
  'arg': 'Aragonese'
  'arm': 'Armenian'
  'asm': 'Assamese'
  'ava': 'Avaric'
  'ave': 'Avestan'
  'aym': 'Aymara'
  'aze': 'Azerbaijani'
  'bak': 'Bashkir'
  'bam': 'Bambara'
  'baq': 'Basque'
  'bel': 'Belarusian'
  'ben': 'Bengali'
  'bis': 'Bislama'
  'bos': 'Bosnian'
  'bre': 'Breton'
  'bul': 'Bulgarian'
  'bur': 'Burmese'
  'cat': 'Catalan'
  'cha': 'Chamorro'
  'che': 'Chechen'
  'chi': 'Chinese'
  'chv': 'Chuvash'
  'cor': 'Cornish'
  'cos': 'Corsican'
  'cre': 'Cree'
  'cze': 'Czech'
  'dan': 'Danish'
  'div': 'Maldivian'
  'dut': 'Dutch'
  'dzo': 'Dzongkha'
  'eng': 'English'
  'epo': 'Esperanto'
  'est': 'Estonian'
  'ewe': 'Ewe'
  'fao': 'Faroese'
  'fij': 'Fijian'
  'fin': 'Finnish'
  'fre': 'French'
  'fry': 'Western Frisian'
  'ful': 'Fulah'
  'geo': 'Georgian'
  'ger': 'German'
  'gla': 'Gaelic'
  'gle': 'Irish'
  'glg': 'Galician'
  'glv': 'Manx'
  'gre': 'Greek'
  'grn': 'Guarani'
  'guj': 'Gujarati'
  'hat': 'Haitian'
  'hau': 'Hausa'
  'heb': 'Hebrew'
  'her': 'Herero'
  'hin': 'Hindi'
  'hmo': 'Hiri Motu'
  'hrv': 'Croatian'
  'hun': 'Hungarian'
  'ibo': 'Igbo'
  'ice': 'Icelandic'
  'ido': 'Ido'
  'iii': 'Sichuan Yi'
  'iku': 'Inuktitut'
  'ile': 'Interlingue'
  'ina': 'Interlingua'
  'ind': 'Indonesian'
  'ipk': 'Inupiaq'
  'ita': 'Italian'
  'jav': 'Javanese'
  'jpn': 'Japanese'
  'kal': 'Kalaallisut'
  'kan': 'Kannada'
  'kas': 'Kashmiri'
  'kau': 'Kanuri'
  'kaz': 'Kazakh'
  'khm': 'Central Khmer'
  'kik': 'Kikuyu'
  'kin': 'Kinyarwanda'
  'kir': 'Kirghiz'
  'kom': 'Komi'
  'kon': 'Kongo'
  'kor': 'Korean'
  'kua': 'Kuanyama'
  'kur': 'Kurdish'
  'lao': 'Lao'
  'lat': 'Latin'
  'lav': 'Latvian'
  'lim': 'Limburgish'
  'lin': 'Lingala'
  'lit': 'Lithuanian'
  'ltz': 'Luxembourgish'
  'lub': 'Luba-Katanga'
  'lug': 'Ganda'
  'mac': 'Macedonian'
  'mah': 'Marshallese'
  'mal': 'Malayalam'
  'mao': 'Maori'
  'mar': 'Marathi'
  'may': 'Malay'
  'mlg': 'Malagasy'
  'mlt': 'Maltese'
  'mon': 'Mongolian'
  'nau': 'Nauru'
  'nav': 'Navajo'
  'nbl': 'South Ndebele'
  'nde': 'North Ndebele'
  'ndo': 'Ndonga'
  'nep': 'Nepali'
  'nno': 'Norwegian Nynorsk'
  'nob': 'Norwegian Bokmål'
  'nor': 'Norwegian'
  'nya': 'Chichewa'
  'oci': 'Occitan'
  'oji': 'Ojibwa'
  'ori': 'Oriya'
  'orm': 'Oromo'
  'oss': 'Ossetian'
  'pan': 'Punjabi'
  'per': 'Persian'
  'pli': 'Pali'
  'pol': 'Polish'
  'por': 'Portuguese'
  'pus': 'Pashto'
  'que': 'Quechua'
  'roh': 'Romansh'
  'rum': 'Romanian'
  'run': 'Rundi'
  'rus': 'Russian'
  'sag': 'Sango'
  'san': 'Sanskrit'
  'sin': 'Sinhalese'
  'slo': 'Slovak'
  'slv': 'Slovenian'
  'sme': 'Northern Sami'
  'smo': 'Samoan'
  'sna': 'Shona'
  'snd': 'Sindhi'
  'som': 'Somali'
  'sot': 'Southern Sotho'
  'spa': 'Spanish'
  'srd': 'Sardinian'
  'srp': 'Serbian'
  'ssw': 'Swati'
  'sun': 'Sundanese'
  'swa': 'Swahili'
  'swe': 'Swedish'
  'tah': 'Tahitian'
  'tam': 'Tamil'
  'tat': 'Tatar'
  'tel': 'Telugu'
  'tgk': 'Tajik'
  'tgl': 'Tagalog'
  'tha': 'Thai'
  'tib': 'Tibetan'
  'tir': 'Tigrinya'
  'ton': 'Tonga'
  'tsn': 'Tswana'
  'tso': 'Tsonga'
  'tuk': 'Turkmen'
  'tur': 'Turkish'
  'twi': 'Twi'
  'uig': 'Uighur'
  'ukr': 'Ukrainian'
  'urd': 'Urdu'
  'uzb': 'Uzbek'
  'ven': 'Venda'
  'vie': 'Vietnamese'
  'vol': 'Volapük'
  'wel': 'Welsh'
  'wln': 'Walloon'
  'wol': 'Wolof'
  'xho': 'Xhosa'
  'yid': 'Yiddish'
  'yor': 'Yoruba'
  'zha': 'Zhuang'
  'zul': 'Zulu'


###
  Formatters.
###


## Format an array of video streams.
helpers.stream.videoFormat = (videoStreams) ->
  for i, stream of videoStreams
    match = {label: 'SD'}
    if stream.height and stream.height > 0
       match = _.find( helpers.stream.videoSizeMap, (res) -> (if res.min < stream.height <= res.max then true else false) )
    videoStreams[i].label = stream.codec + ' ' + match.label + ' (' + stream.width + ' x ' + stream.height + ')'
    videoStreams[i].shortlabel = stream.codec + ' ' + match.label
    videoStreams[i].res = match.label
  videoStreams


## Formatter for language codes
helpers.stream.formatLanguage = (lang) ->
  if helpers.stream.langMap[lang]
    helpers.stream.langMap[lang]
  else
    lang


## Format an array of audio streams.
helpers.stream.audioFormat = (audioStreams) ->
  for i, stream of audioStreams
    ch = _.findWhere helpers.stream.audioChannelMap, {channels: stream.channels}
    ch = if ch then ch.label else stream.channels
    lang = ''
    if stream.language isnt ''
      lang = ' (' + helpers.stream.formatLanguage(stream.language) + ')'
    audioStreams[i].label = stream.codec + ' ' + ch + lang
    audioStreams[i].shortlabel = stream.codec + ' ' + ch
    audioStreams[i].ch = ch
  audioStreams


## Format an array of subtitles
helpers.stream.subtitleFormat = (subtitleStreams) ->
  for i, stream of subtitleStreams
    subtitleStreams[i].label = helpers.stream.formatLanguage(stream.language)
    subtitleStreams[i].shortlabel = helpers.stream.formatLanguage(stream.language)
  subtitleStreams


## Format ALL streams
helpers.stream.streamFormat = (streams) ->
  streamTypes = ['audio', 'video', 'subtitle']
  for type in streamTypes
    if streams[type] and streams[type].length > 0
      streams[type] = helpers.stream[type + 'Format'](streams[type])
    else
      streams[type] = []
  streams
