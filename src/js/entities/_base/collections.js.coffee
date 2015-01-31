@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Collection extends Backbone.Collection

    ## Return the raw entities stored against this collection
    ## as an array of json objects (not models)
    getRawCollection: ->
      objs = [];
      if @models.length > 0
        for model in @models
          objs.push model.attributes
      objs
