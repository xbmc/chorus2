/**
 * Instantiate our app object.
 */
var app = {
  core: {},
  views: {},
  viewsCached: {},
  controller: {}
};

/**
 * Our core application.
 */
app.core.App = Marionette.Application.extend( {

  regions: function() {
    return {
      root: 'body'
    };
  },

  start: function( options ) {

    var self = this;

    // Load the templates.
    app.template.loadTemplates(app.template.preLoadedTemplates,
      function () {

        // Once the templates are loaded we kick everything off.
        self.appReady();

      });

  },

  appReady: function() {

    // Start the router.
    this.Router = new app.core.Router( { controller: new app.core.Controller() } );

    // Start history.
    Backbone.history.start();

    // Show the shell view.
    this.root.show( new app.Shell.View() );

    // Start shell view
    app.shell = new app.Shell();
    app.shell.start();

  }

});


/**
 * The core router.
 */
app.core.Router = Marionette.AppRouter.extend({
  appRoutes: {
    "home": "homePage"
  }
});


/**
 * The core controller.
 */
app.core.Controller = Marionette.Controller.extend({

  initialize: function() {
    this.appInstance = new app.core.App();
  },

  homePage: function(){
    var foo = 'bar';
  }
  
});


/**
 * Application Ready.
 */
$(document).on("ready", function () {
  var kodi = new app.core.App();
  kodi.start();
});
