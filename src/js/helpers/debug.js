// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Handle errors.
*/
helpers.debug = {
  verbose: false
};


/*
  Debug styles

  @param severity
  The severity level: info, success, warning, error
*/
helpers.debug.consoleStyle = function(severity = 'error') {
  const defaults = {
    background: "#ccc",
    padding: "0 5px",
    color: "#444",
    "font-weight": "bold",
    "font-size": "110%"
  };

  const styles = [];
  const mods = {
    info: "#D8FEFE",
    success: "#CCFECD",
    warning: "#FFFDD9",
    error: "#FFCECD"
  };

  defaults.background = mods[severity];
  for (var prop in defaults) {
    styles.push(prop + ": " + defaults[prop]);
  }
  return styles.join("; ");
};


/*
  Basic debug message
*/
helpers.debug.msg = function(msg, severity = 'info', data) {
  if (typeof console !== 'undefined' && console !== null) {
    console.log(`%c ${msg}`, helpers.debug.consoleStyle(severity));
    if (data != null) {
      return console.log(data);
    }
  }
};


/*
  Log a debug error message.
*/
helpers.debug.log = function(msg, data = 'No data provided', severity = 'error', caller) {
  if (caller == null) { caller = arguments.callee.caller.toString(); }

  if ((data[0] != null) && (data[0].error === "Internal server error")) {
    //# Dont log anything
  } else {
    if (typeof console !== 'undefined' && console !== null) {
      console.log(`%c Error in: ${msg}`, helpers.debug.consoleStyle(severity), data);
      if (helpers.debug.verbose && (caller !== false)) {
        return console.log(caller);
      }
    }
  }
};


/*
  Request Error.
*/
helpers.debug.rpcError = function(commands, data) {
  const detail = {called: commands};
  let msg = '';
  if (data.error && data.error.message) {
    msg = '"' + data.error.message + '"';
    detail.error = data.error;
  } else {
    detail.error = data;
  }
  return helpers.debug.log(`jsonRPC request - ${msg}`, detail, 'error');
};

/*
  JSON Dump (pretty print)
*/
helpers.debug.syntaxHighlight = function(json) {
  json = JSON.stringify(json, null, 4);
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const out = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    let cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
  return '<pre class="json-syntax-highlight">' + out + '</pre>';
};
