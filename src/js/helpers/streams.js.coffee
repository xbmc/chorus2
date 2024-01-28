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
  'und':        'Unknown'
  'Afar':       'aar'
  'Abkhazian':  'abk'
  'Afrikaans':  'afr'
  'Akan':       'aka'
  'Albanian':   'alb'
  'Amharic':    'amh'
  'Arabic':     'ara'
  'Aragonese':  'arg'
  'Armenian':	'arm'
  'Assamese':	'asm'
  'Avaric':     'ava'
  'Avestan':    'ave'
  'Aymara':     'aym'
  'Azerbaijani':    'aze'
  'Bashkir':    'bak'
  'Bambara':    'bam'
  'Basque':     'baq'
  'Belarusian': 'bel'
  'Bengali':    'ben'
  'Bislama':    'bis'
  'Bosnian':    'bos'
  'Breton':     'bre'
  'Bulgarian':  'bul'
  'Burmese':    'bur'
  'Catalan':    'cat'
  'Chamorro':   'cha'
  'Chechen':    'che'
  'Chinese':    'chi'
  'Chuvash':    'chv'
  'Cornish':    'cor'
  'Corsican':   'cos'
  'Cree':       'cre'
  'Czech':      'cze'
  'Danish':     'dan'
  'Maldivian':  'div'
  'Dutch':      'dut'
  'Dzongkha':   'dzo'
  'English':    'eng'
  'Esperanto':  'epo'
  'Estonian':   'est'
  'Ewe':        'ewe'
  'Faroese':    'fao'
  'Fijian':     'fij'
  'Finnish':    'fin'
  'French':     'fre'
  'Western Frisian': 'fry'
  'Fulah':      'ful'
  'Georgian':   'geo'
  'German':     'ger'
  'Gaelic':     'gla'
  'Irish':      'gle'
  'Galician':   'glg'
  'Manx':       'glv'
  'Greek':      'gre'
  'Guarani':    'grn'
  'Gujarati':   'guj'
  'Haitian':    'hat'
  'Hausa':      'hau'
  'Hebrew':     'heb'
  'Herero':     'her'
  'Hindi':      'hin'
  'Hiri Motu':  'hmo'
  'Croatian':   'hrv'
  'Hungarian':  'hun'
  'Igbo':       'ibo'
  'Icelandic':  'ice'
  'Ido':        'ido'
  'Sichuan Yi': 'iii'
  'Inuktitut':  'iku'
  'Interlingue':    'ile'
  'Interlingua':    'ina'
  'Indonesian': 'ind'
  'Inupiaq':    'ipk'
  'Italian':    'ita'
  'Javanese':   'jav'
  'Japanese':   'jpn'
  'Kalaallisut':    'kal'
  'Kannada':    'kan'
  'Kashmiri':   'kas'
  'Kanuri':     'kau'
  'Kazakh':     'kaz'
  'Central Khmer':  'khm'
  'Kikuyu':     'kik'
  'Kinyarwanda':    'kin'
  'Kirghiz':    'kir'
  'Komi':       'kom'
  'Kongo':      'kon'
  'Korean':     'kor'
  'Kuanyama':   'kua'
  'Kurdish':    'kur'
  'Lao':        'lao'
  'Latin':      'lat'
  'Latvian':    'lav'
  'Limburgish': 'lim'
  'Lingala':    'lin'
  'Lithuanian': 'lit'
  'Luxembourgish':  'ltz'
  'Luba-Katanga':   'lub'
  'Ganda':      'lug'
  'Macedonian': 'mac'
  'Marshallese':    'mah'
  'Malayalam':  'mal'
  'Maori':      'mao'
  'Marathi':    'mar'
  'Malay':      'may'
  'Malagasy':   'mlg'
  'Maltese':    'mlt'
  'Mongolian':  'mon'
  'Nauru':      'nau'
  'Navajo':     'nav'
  'South Ndebele':  'nbl'
  'North Ndebele':  'nde'
  'Ndonga':     'ndo'
  'Nepali':     'nep'
  'Norwegian Nynorsk':  'nno'
  'Norwegian Bokmål':   'nob'
  'Norwegian':  'nor'
  'Chichewa':   'nya'
  'Occitan':    'oci'
  'Ojibwa':     'oji'
  'Oriya':      'ori'
  'Oromo':      'orm'
  'Ossetian':   'oss'
  'Punjabi':    'pan'
  'Persian':    'per'
  'Pali':       'pli'
  'Polish':     'pol'
  'Portuguese': 'por'
  'Pashto':     'pus'
  'Quechua':    'que'
  'Romansh':    'roh'
  'Romanian':   'rum'
  'Rundi':      'run'
  'Russian':    'rus'
  'Sango':      'sag'
  'Sanskrit':   'san'
  'Sinhalese':  'sin'
  'Slovak':     'slo'
  'Slovenian':  'slv'
  'Northern Sami':  'sme'
  'Samoan':     'smo'
  'Shona':      'sna'
  'Sindhi':     'snd'
  'Somali':     'som'
  'Southern Sotho': 'sot'
  'Spanish':    'spa'
  'Sardinian':  'srd'
  'Serbian':    'srp'
  'Swati':      'ssw'
  'Sundanese':  'sun'
  'Swahili':    'swa'
  'Swedish':    'swe'
  'Tahitian':   'tah'
  'Tamil':      'tam'
  'Tatar':      'tat'
  'Telugu':     'tel'
  'Tajik':      'tgk'
  'Tagalog':    'tgl'
  'Thai':       'tha'
  'Tibetan':    'tib'
  'Tigrinya':   'tir'
  'Tonga':      'ton'
  'Tswana':     'tsn'
  'Tsonga':     'tso'
  'Turkmen':    'tuk'
  'Turkish':    'tur'
  'Twi':        'twi'
  'Uighur':     'uig'
  'Ukrainian':  'ukr'
  'Urdu':       'urd'
  'Uzbek':      'uzb'
  'Venda':      'ven'
  'Vietnamese': 'vie'
  'Volapük':    'vol'
  'Welsh':      'wel'
  'Walloon':    'wln'
  'Wolof':      'wol'
  'Xhosa':      'xho'
  'Yiddish':    'yid'
  'Yoruba':     'yor'
  'Zhuang':     'zha'
  'Zulu':       'zul'


###
  Formatters.
###

## Textual representation of aspect ratio
helpers.stream.aspectRatio = (rawAspect) ->
  if (rawAspect < 1.3499)
    return '1.33:1'

  if (rawAspect < 1.5080)
    return '1.37:1'

  if (rawAspect < 1.719)
    return '1.66:1'

  if (rawAspect < 1.8147)
    return '16:9'

  if (rawAspect < 2.0174)
    return '1.85:1'

  if (rawAspect < 2.2738)
    return '2.20:1'

  if (rawAspect < 2.3749)
    return '2.35:1'

  if (rawAspect < 2.4739)
    return '2.40:1'

  if (rawAspect < 2.6529)
    return '2.55:1'

  return 'Unknown Aspect Ratio'

## Format an array of video streams.
helpers.stream.videoFormat = (videoStreams) ->
  for i, stream of videoStreams
    match = {label: 'SD'}
    if stream.height and stream.height > 0
       match = _.find( helpers.stream.videoSizeMap, (res) -> (if res.min < stream.height <= res.max then true else false) )
    videoStreams[i].label = stream.codec + ' ' + match.label + ' (' + stream.width + ' x ' + stream.height + ') [' + helpers.stream.aspectRatio(stream.aspect) + ']'
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
    if stream.language isnt '' and stream.language isnt 'und'
      lang = ' (' + helpers.stream.formatLanguage(stream.language) + ')'
    audioStreams[i].label = stream.codec + ' ' + ch + lang
    audioStreams[i].shortlabel = stream.codec + ' ' + ch
    audioStreams[i].ch = ch
  audioStreams


## Format an array of subtitles
helpers.stream.subtitleFormat = (subtitleStreams) ->
  distinctLanguages = []
  uniqueStreams = []

  for i, stream of subtitleStreams
    if (distinctLanguages.indexOf(subtitleStreams[i].language) is -1)
      distinctLanguages.push(subtitleStreams[i].language)
      uniqueStreams.push(subtitleStreams[i])

  for i, stream of uniqueStreams
    uniqueStreams[i].label = helpers.stream.formatLanguage(stream.language)
    uniqueStreams[i].shortlabel = helpers.stream.formatLanguage(stream.language)
		
  uniqueStreams


## Format ALL streams
helpers.stream.streamFormat = (streams) ->
  streamTypes = ['audio', 'video', 'subtitle']
  for type in streamTypes
    if streams[type] and streams[type].length > 0
      streams[type] = helpers.stream[type + 'Format'](streams[type])
    else
      streams[type] = []
  streams
