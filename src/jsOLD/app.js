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

  start: function() {

    // Show the shell view.
    app.shell = new app.Shell.View();
    app.appInstance.root.show( app.shell );

    // Add the nav
    var navMain = new app.NavMain.Object();
    app.shell.regionNav.show( new app.NavMain.View({ model: navMain.getStructure() }) );

    // Start the router.
    this.Router = new app.core.Router( { controller: new app.core.Controller() } );

    // Start history.
    Backbone.history.start();

  }

});


/**
 * The core router.
 */
app.core.Router = Marionette.AppRouter.extend({

  appRoutes: {
    "home": "homePage"
  },

  onRoute: function() {
    console.log('route changed');
  }

});


/**
 * The core controller.
 */
app.core.Controller = Marionette.Controller.extend({

  homePage: function(){
    var foo = 'bar';
    app.shell.regionContent.show( new app.Home.View() );
  }

});


/**
 * Application Ready.
 */
$(document).on("ready", function () {

  // Pre-load the templates.
  app.template.loadTemplates(app.template.preLoadedTemplates,
    function () {

      // Start the app.
      app.appInstance = new app.core.App();
      app.appInstance.start();

    });

});
