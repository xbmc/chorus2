
app.Shell = Marionette.Application.extend( {

  regions: function() {
    return {
      regionNav: '#nav-bar',
      regionMain: '#main',
      regionSidebarFirst: '#sidebar-first',
      regionSidebarSecond: '#sidebar-second'
    };
  },

  start: function( options ) {

    // Show the shell view.
    var navController = new app.NavMain();
    this.regionNav.show( new app.NavMain.View({ model: navController.getStructure() }) );


//    var navigationView = new NavigationView();
//
//    // Perform the default 'start' functionality
//    Marionette.Application.prototype.start.apply( this, [ options ] );
//
//    // Add in the site navigation
//    this.regionNav.show( navigationView );
//
//    // Add routers
//    this.Router = new Router( { controller: new Controller() } );
//
//    // Add modules
//    this.module( 'BlueThemeModule', { moduleClass: BlueThemeModule } );
//    this.module( 'RedThemeModule', { moduleClass: RedThemeModule } );
//
//    // This is a very simple demo, and as such I'm going to use
//    // hashes for internal navigation.  If you want Backbone/Marionette
//    // to enforce full URLs use:
//    // Backbone.history.start( { pushState: true } );
//    Backbone.history.start( );
//
//    // show the footer
//    this.regionFooter.show( new UniversalFooter() );

  }

});