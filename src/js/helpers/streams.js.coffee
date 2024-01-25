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

## Map for language codes, TODO: Add more maps
helpers.stream.langMap =
  'eng': 'English'
  'und': 'Unknown'
  'bul': 'Bulgaria'
  'ara': 'Arabic'
  'zho': 'Chinese'
  'ces': 'Czech'
  'dan': 'Danish'
  'nld': 'Netherlands'
  'fin': 'Finish'
  'fra': 'French'
  'deu': 'German'
  'nor': 'Norwegian'
  'pol': 'Polish'
  'por': 'Portuguese'
  'ron': 'Romanian'
  'spa': 'Spanish'
  'swe': 'Swedish'
  'tur': 'Turkish'
  'vie': 'Vietnamese'


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
