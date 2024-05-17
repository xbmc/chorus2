// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Entities mixins, all the common things we do/need on almost every collection

  example of usage:

  collection = new KodiCollection()
    .setEntityType 'collection'
    .setEntityKey 'movie'
    .setEntityFields 'small', ['thumbnail', 'title']
    .setEntityFields 'full', ['fanart', 'genre']
    .setMethod 'VideoLibrary.GetMovies'
    .setArgHelper 'fields'
    .setArgHelper 'limit'
    .setArgHelper 'sort'
    .applySettings()

*/
if (this.KodiMixins == null) { this.KodiMixins = {}; }


KodiMixins.Entities = {

  url() { return helpers.url.baseKodiUrl("Mixins"); },
  rpc: new Backbone.Rpc({
    useNamedParameters: true,
    namespaceDelimiter: ''
  }),


  /*
    Overrides!
  */

//  ## Add the options to the collection so we can use their args with rpc calls.
//  sync: (method, model, options) ->
//    if method is 'read'
//      this.options = options
//    Backbone.sync method, model, options
//
//  ## Parse the response.
//  parse: (resp, xhr) ->
//    respProp = @getEntityKey(@entityType + 'ResponseProperty')
//    if @entityType is 'model'
//      ## If fetched directly, look in movie details and mark as fully loaded
//      obj = if resp[respProp]? then resp[respProp] else resp
//      if resp[respProp]?
//        obj.fullyloaded = true
//      @parseModel @getEntityKey('type'), obj, obj[@getEntityKey('idProperty')]
//    else
//      ## collection
//      resp[respProp]



//  ###
//    Parse the model before adding to the collection
//    Here we can add generic goodies to all models.
//  ###
//  parseModel: (type, model, id) ->
//    model.id = id
//    model = App.request "images:path:entity", model
//    model.url = helpers.url.get type, id
//    model.type = type
//    model


  /*
    Apply all the defined settings.
  */
  applySettings() {
    //# @buildRpcRequest()
    if (this.entityType === 'model') {
      return this.setModelDefaultFields();
    }
  },


  /*
    What kind of entity are we dealing with. collection or model
  */
  entityType: 'model',
  setEntityType(type) {
    this.entityType = type;
    return this;
  },


  /*
    Entity Keys, properties that change between the entities
  */
  entityKeys: {
    type: '',
    modelResponseProperty: '',
    collectionResponseProperty: '',
    idProperty: ''
  },

  setEntityKey(key, value) {
    this.entityKeys[key] = value;
    return this;
  },

  //# Type is the only required, autodetect others.
  getEntityKey(key) {
    let ret;
    const {
      type
    } = this.entityKeys;
    switch (key) {
      case 'modelResponseProperty':
        ret = (this.entityKeys[key] != null) ? this.entityKeys[key] : type + 'details';
        break;
      case 'collectionResponseProperty':
        ret = (this.entityKeys[key] != null) ? this.entityKeys[key] : type + 's';
        break;
      case 'idProperty':
        ret = (this.entityKeys[key] != null) ? this.entityKeys[key] : type + 'id';
        break;
      default:
        ret = type;
    }
    return ret;
  },


  /*
    The types of fields we request, minimal for search, small for list, full for page.
  */
  entityFields: {
    minimal: [],
    small: [],
    full: []
  },

  setEntityFields(type, fields = []) {
    this.entityFields[type] = fields;
    return this;
  },

  getEntityFields(type) {
    const fields = this.entityFields.minimal;
    if (type === 'full') {
      return fields.concat(this.entityFields.small).concat(this.entityFields.full);
    } else if (type === 'small') {
      return fields.concat(this.entityFields.small);
    } else {
      return fields;
    }
  },

  //# Common model fields (not valid kodi response properties)
  modelDefaults: {
    id: 0,
    fullyloaded: false,
    thumbnail: '',
    thumbsUp: false
  },

  //# Define the model fields using a null default.
  setModelDefaultFields(defaultFields = {}) {
    defaultFields = _.extend(this.modelDefaults, defaultFields);
    return this.getEntityFields('full').map((field) =>
      (this.defaults[field] = ''));
  },


  /*
    JsonRPC common patterns and helpers.
  */
  callMethodName: '',
  callArgs: [],
  callIgnoreArticle: true,

  //# Set method
  setMethod(method) {
    this.callMethodName = method;
    return this;
  },

  //# Args must be set in the correct order!

  //# Set a static argument
  setArgStatic(callback) {
    this.callArgs.push( callback );
    return this;
  },

  //# Set a helper argument
  setArgHelper(helper, param1, param2) {
    const func = 'argHelper' + helper;
    this.callArgs.push( this[func](param1, param2) );
    return this;
  },

  //# Common arg patterns all checking if the params exist in options first.
  argCheckOption(option, fallback) {
    if ((this.options != null) && (this.options[option] != null)) {
      return this.options[option];
    } else {
      return fallback;
    }
  },

  //# Our arg helpers
  argHelperfields(type = 'small') {
    const arg = this.getEntityFields(type);
    return this.argCheckOption('fields', arg);
  },

  argHelpersort(method, order = 'ascending') {
    const arg = {method, order, ignorearticle: this.callIgnoreArticle};
    return this.argCheckOption('sort', arg);
  },

  argHelperlimit(start = 0, end = 'all') {
    const arg = {start};
    if (end !== 'all') {
      arg.end = end;
    }
    return this.argCheckOption('limit', arg);
  },

  argHelperfilter(name, value) {
    const arg = {};
    if (name != null) {
      arg[name] = value;
    }
    return this.argCheckOption('filter', arg);
  },

  //# Apply the methods + args to entity (build request)
  buildRpcRequest(type = 'read') {
    const req = [this.callMethodName];
    for (var arg of this.callArgs) {
      var func = 'argHelper' + arg;
      //# if a callback (collection)
      if (typeof func === 'function') {
        var key = 'arg' + req.length;
        req.push(key);
        this[key] = func;
      } else {
        //# if a string (model)
        req.push(arg);
      }
    }
    //# Set the method
    return req;
  }
};
