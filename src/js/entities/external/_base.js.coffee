@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.ExternalEntity extends Entities.Model
    defaults:
      id: ''
      title: ''
      desc: ''
      thumbnail: ''
      url: ''
      type: ''
      provider: ''

  class Entities.ExternalCollection extends Entities.Collection
    model: Entities.ExternalEntity