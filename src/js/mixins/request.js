/**
 * Use promises to make requests.
 */

app.request = {};

/**
 * A Wrapper for jquery ajax to use promises.
 *
 * @param url
 */
app.request.ajax = function(url) {
  var jsPromise = Promise.resolve($.ajax(url));
  return jsPromise;
};
