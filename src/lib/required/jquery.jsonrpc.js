/*
 * jQuery JSON-RPC Plugin
 *
 * @version: 1.0(2014-08-31)
 * @author hagino3000 <http://twitter.com/hagino3000> (Takashi Nishibayashi)
 * @author alanjds <http://twitter.com/alanjds> (Alan Justino da Silva)
 *
 * A JSON-RPC 2.0 implementation for jQuery.
 * JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol.
 * Read more in the <http://www.jsonrpc.org/specification>
 */
(function($) {
  var rpcId = 1;
  var emptyFn = function(){};

  function makePostPayload(rpcParam) {
    return {
      jsonrpc: '2.0',
      method: rpcParam.method || '',
      params: rpcParam.params || {},
      id: rpcId++
    };
  }

  function makePostBody(rpcParam) {
    var payload = $.isArray(rpcParam) ? rpcParam.map(makePostPayload) : makePostPayload(rpcParam);
    return JSON.stringify(payload);
  }

  function sortBatchResults(results) {
    return results.sort(rpcIdComparator);
  }

  function rpcIdComparator(a, b) {
    return a.id < b.id ? -1 : 1;
  }

  function jsonrpc(rpcParam, ajaxOpts) {
    var deferred = new $.Deferred();

    ajaxOpts = ajaxOpts || {};
    var successCallback = ajaxOpts.success || emptyFn;
    var errorCallback = ajaxOpts.error || emptyFn;
    delete ajaxOpts.success;
    delete ajaxOpts.error;

    var isBatch = $.isArray(rpcParam);
    var ajaxParams = $.extend({
      url: (isBatch ? rpcParam[0].url : rpcParam.url) || $.jsonrpc.defaultUrl,
      contentType: 'application/json',
      dataType: 'text',
      dataFilter: function(data, type) {
        return JSON.parse(data);
      },
      type: 'POST',
      processData: false,
      data: makePostBody(rpcParam),
      success: function(resp) {
        if (isBatch) {
          var orderedResults = sortBatchResults(resp);
          successCallback(orderedResults);
          deferred.resolve(orderedResults);
          return;
        } else {
          if (resp.hasOwnProperty('error')) {
            // HTTP Response 20x but error
            errorCallback(resp.error);
            deferred.reject(resp.error);
            return;
          }
          if (resp.hasOwnProperty('result')) {
            successCallback(resp.result);
            deferred.resolve(resp.result);
            return;
          }
        }
        throw 'Invalid response returned';
      },
      error: function(xhr, status, error) {
        var result = null;
        if (error === 'timeout') {
          result = {
            status: status,
            code: -32000,
            message: "Request Timeout",
            data: null
          };
        } else {
          try {
            var res = JSON.parse(xhr.responseText);
            result = res.error;
          } catch (e) {
            result = {
              status: status,
              code: -32603,
              message: error,
              data: xhr.responseText
            };
          }
        }
        errorCallback(result);
        deferred.reject(result);
      }
    }, ajaxOpts);

    $.ajax(ajaxParams);

    return deferred.promise();
  }

  $.extend({
    jsonrpc: jsonrpc
  });
  $.jsonrpc.defaultUrl = '/jsonrpc';

})(jQuery);