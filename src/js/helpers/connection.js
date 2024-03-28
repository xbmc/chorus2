/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Connection helpers. For live connecting and disconnecting from Kodi.
*/
helpers.connection = {};

//# Attempt to reconnect a disconnected shell.
helpers.connection.reconnect = success => helpers.connection.ping((function() {
  //# Successful reconnect!
  config.setLocal('connected', true);
  Kodi.execute('state:ws:init');
  return success();
}), () => Kodi.execute('shell:disconnect'));

//# Disconnect the shell.
helpers.connection.disconnect = () => config.setLocal('connected', false);

//# We manually call a ping to specify a reduced timeout.
helpers.connection.ping = function(success, fail) {
  const d = new Date();
  return $.ajax({
    url: helpers.url.baseKodiUrl("Ping"),
    timeout: 3000,
    contentType: 'application/json',
    type:'POST',
    data: JSON.stringify({jsonrpc: '2.0', method: 'JSONRPC.Ping', params: {}, id: d.getTime()}),
    success,
    error: fail
  });
};
