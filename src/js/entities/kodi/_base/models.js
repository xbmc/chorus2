// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (KodiEntities.Model = class Model extends App.Entities.Model {
    static initClass() {
      this.prototype.rpc = new Backbone.Rpc({
        useNamedParameters: true,
        namespaceDelimiter: ''
      });
      this.prototype.modelDefaults = {
        fullyloaded: false,
        thumbnail: '',
        thumbsUp: 0,
        parsed: false,
        progress: 0
      };
    }

    initialize() {
      if (this.methods) {
        // On model update (eg edit) reload the model
        return App.vent.on('entity:kodi:update', uid => {
          if (this.get('uid') === uid) {
            const fields = App.request(this.get('type') + ":fields");
            if (fields && (fields.length > 0)) {
              return this.fetch({properties: fields, success: updatedModel => {
                return Backbone.fetchCache.clearItem(updatedModel);
              }
              });
            }
          }
        });
      }
    }

    url() { return helpers.url.baseKodiUrl(this.constructor.name); }

    //# This is our generic way of updating things that need to be
    //# added or changed on all models prior to creation, should be
    //# called during model.parse()
    parseModel(type, model, id) {
      if (!model.parsed) {

        // Setup some additional attributes
        if (id !== 'mixed') {
          model.id = id;
        }
        if (model.rating) {
          model.rating = helpers.global.rating(model.rating);
        }
        if (model.streamdetails && _.isObject(model.streamdetails)) {
          model.streamdetails = helpers.stream.streamFormat(model.streamdetails);
        }
        if (model.resume) {
          model.progress = model.resume.position === 0 ? 0 : Math.round((model.resume.position / model.resume.total) * 100);
        }
        if (model.trailer) {
          model.mediaTrailer = helpers.url.parseTrailerUrl(model.trailer);
        }
        if (model.starttime) {
          model.start = helpers.global.dateStringToObj(model.starttime);
        }
        if (model.endtime) {
          model.end = helpers.global.dateStringToObj(model.endtime);
        }

        // artwork is in art map since kodi 19. Fallbacks of poster to thumb have been removed
        if ((type === 'movie') || (type === 'tvshow') || (type === 'season')) {
          model.fanart = 'fanart' in model.art ? model.art.fanart : undefined;
          model.thumbnail = (() => {
            if ('poster' in model.art) { return model.art.poster; } else if ('thumb' in model.art) { return model.art.thumb; }
          })();
        }

        if ((type === 'tvshow') || (type === 'season')) {
          model.progress = helpers.global.round(((model.watchedepisodes / model.episode) * 100), 2);
        }
        if ((type === 'episode') || ((type === 'movie') && (model.progress === 0))) {
          model.progress = model.playcount === 0 ? 0 : 100;
        }
        if ((type === 'album') || (type === 'artist')) {
          model.progress = 0;
        }

        // Set URL.
        if (type === 'episode') {
          model.url = helpers.url.get(type, id, {':tvshowid': model.tvshowid, ':season': model.season});
        } else if (type === 'channel') {
          //# Check pvr for subtype
          if (model.channeltype === 'tv') { type = "channeltv"; } else { type = "channelradio"; }
          model.url = helpers.url.get(type, id);
        } else {
          model.url = helpers.url.get(type, id);
        }

        model = App.request("images:path:entity", model);
        model.type = type;
        model.uid = helpers.entities.createUid(model, type);
        model.parsed = true;
      }
      return model;
    }

    //# Parse fields into defaults. Sets all to null.
    parseFieldsToDefaults(fields, defaults = {}) {
      for (var field of fields) {
        defaults[field] = '';
      }
      return defaults;
    }

    // Check the response, it might be cached and parsing can be skipped.
    //
    // @param [Object] Response from the API
    // @param [String] The key to check against.
    // @return [Object] the response with the fullyloaded property set if parsing can be skipped.
    //
    checkResponse(response, checkKey) {
      const obj = (response[checkKey] != null) ? response[checkKey] : response;
      if (response[checkKey] != null) {
        obj.fullyloaded = true;
      }
      return obj;
    }
  });
  Cls.initClass();
  return Cls;
})());
