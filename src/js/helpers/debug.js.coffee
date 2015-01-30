###
  Handle errors.
###
helpers.debug = {}


###
  Debug styles

  @param severity
  The severity level: info, success, warning, error
###
helpers.debug.consoleStyle = (severity) ->
  defaults =
    background: "#ccc"
    padding: "0 5px"
    color: "#444"
    "font-weight": "bold"
    "font-size": "110%"

  styles = []
  mods =
    info: "#D8FEFE"
    success: "#CCFECD"
    warning: "#FFFDD9"
    error: "#FFCECD"

  defaults.background = mods[severity]  if style?
  for prop of defaults
    styles.push prop + ": " + defaults[prop]
  styles.join "; "


###
  Log a deubg message.
###
helpers.debug.log = (msg, data = 'No data provided', severity = 'error', caller) ->
  caller ?= arguments.callee.caller.toString()

  if data[0]? and data[0].error is "Internal server error"
    ## Dont log anything
    msg
  else
    console.log "%c Bam! Error occurred in: #{caller}", helpers.debug.consoleStyle(severity), data


###
  Request Error.
###
helpers.debug.rpcError = (obj) ->
  caller = arguments.callee.caller.toString()
  helpers.debug.log "jsonRPC Rquequest", obj, 'error', caller
