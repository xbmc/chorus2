@Kodi.module "CastApp", (CastApp, App, Backbone, Marionette, $, _) ->


  API =

    getCastCollection: (cast, origin) ->
      App.request "cast:entities", cast, origin

    getCastView: (collection) ->
      console.log collection
      view = new CastApp.List.CastList
        collection: collection
      App.listenTo view, 'childview:cast:google', (parent, child) ->
        window.open('https://www.google.com/webhp?#q=' + encodeURIComponent(child.model.get('name')))
      App.listenTo view, 'childview:cast:imdb', (parent, child) ->
        window.open('http://www.imdb.com/find?s=nm&q=' + encodeURIComponent(child.model.get('name')))
      view


  App.reqres.setHandler 'cast:list:view', (cast, origin) ->
    collection = API.getCastCollection cast, origin
    API.getCastView collection
