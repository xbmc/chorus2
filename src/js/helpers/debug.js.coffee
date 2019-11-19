###
  Handle errors.
###
helpers.debug = {
  verbose: false
}


###
  Debug styles

  @param severity
  The severity level: info, success, warning, error
###
helpers.debug.consoleStyle = (severity = 'error') ->
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

  defaults.background = mods[severity]
  for prop of defaults
    styles.push prop + ": " + defaults[prop]
  styles.join "; "


###
  Basic debug message
###
helpers.debug.msg = (msg, severity = 'info', data) ->
  if console?
    console.log "%c #{msg}", helpers.debug.consoleStyle(severity)
    if data?
      console.log data


###
  Log a debug error message.
###
helpers.debug.log = (msg, data = 'No data provided', severity = 'error', caller) ->
  caller ?= arguments.callee.caller.toString()

  if data[0]? and data[0].error is "Internal server error"
    ## Dont log anything
  else
    if console?
      console.log "%c Error in: #{msg}", helpers.debug.consoleStyle(severity), data
      if helpers.debug.verbose and caller isnt false
        console.log caller


###
  Request Error.
###
helpers.debug.rpcError = (commands, data) ->
  detail = called: commands
  msg = ''
  if data.error and data.error.message
    msg = '"' + data.error.message + '"'
    detail.error = data.error
  else
    detail.error = data
  helpers.debug.log "jsonRPC request - #{msg}", detail, 'error'

###
  JSON Dump (pretty print)
###
helpers.debug.syntaxHighlight = (json) ->
  json = JSON.stringify json, null, 4
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  out = json.replace /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) ->
    cls = 'number'
    if /^"/.test(match)
      if /:$/.test(match)
        cls = 'key'
      else
        cls = 'string'
    else if /true|false/.test(match)
      cls = 'boolean'
    else if /null/.test(match)
      cls = 'null'
    '<span class="' + cls + '">' + match + '</span>'
  '<pre class="json-syntax-highlight">' + out + '</pre>'
