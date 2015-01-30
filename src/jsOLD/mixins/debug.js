/**
 * Handle errors.
 */

app.debug = {};

/**
 * Debug styles
 *
 * @param severity
 *   The severity level: info, success, warning, error
 */
app.debug.consoleStyle = function(severity){

  var defaults = {
    background: '#ccc',
    padding: '0 5px',
    color: '#444',
    'font-weight': 'bold',
    'font-size': '110%'
  }, styles = [];

  var mods = {
    info: '#D8FEFE',
    success: '#CCFECD',
    warning: '#FFFDD9',
    error: '#FFCECD'
  };

  if(style !== undefined){
    defaults.background = mods[severity];
  }

  for(var prop in defaults){
    styles.push(prop + ': ' + defaults[prop]);
  }

  return styles.join('; ');
};


/**
 * Log a debug message.
 *
 * @param msg
 *   Text to log.
 * @param data
 *   Data object returned.
 * @param severity
 *   Severity level, defaults to error.
 * @param caller
 *   Who called the error.
 */
app.debug.log = function(msg, data, severity, caller) {

  // Default severity level.
  if (severity === undefined) {
    severity = 'error';
  }

  // ensure we have data.
  if (data === undefined) {
    data = 'No data provided';
  }

  // Function calling this.
  if (caller === undefined) {
    caller = arguments.callee.caller.toString();
  }

  if(typeof data[0] != 'undefined' && data[0].error == "Internal server error"){
    // Don't log no connection errors.
  } else {
    // Log the error.
    console.log('%c Bam! Error occurred in "' + caller + '": ' + msg, app.debug.consoleStyle(severity), data);
  }

};

/**
 * Wrapper for a reqest error.
 *
 * @param obj
 */
app.debug.requestError = function(obj) {
  var caller = arguments.callee.caller.toString();
  app.debug.log('Ajax Request', obj, 'error', caller);
};
