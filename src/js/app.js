// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//# Our global objects
this.helpers = {};
this.config = {
  static: {
    appTitle: 'Kodi',
    jsonRpcEndpoint: 'jsonrpc',
    socketsHost: location.hostname,
    socketsPort: 9090,
    ajaxTimeout: 5000,
    connected: true,
    hashKey: 'kodi',
    defaultPlayer: 'auto',
    ignoreArticle: true,
    pollInterval: 10000,
    reverseProxy: false,
    albumArtistsOnly: true,
    searchIndexCacheExpiry: (24 * 60 * 60), // 1 day
    collectionCacheExpiry: (7 * 24 * 60 * 60), // 1 week (gets wiped on library update)
    addOnsLoaded: false,
    vibrantHeaders: false,
    lang: "en",
    kodiSettingsLevel: 'standard',
    playlistFocusPlaying: true,
    keyboardControl: 'kodi',
    disableThumbs: false,
    showDeviceName: false,
    refreshIgnoreNFO: true,
    largeBreakpoint: 910,
    apiKeyTMDB: '',
    apiKeyTVDB: '',
    apiKeyFanartTv: '',
    apiKeyYouTube: ''
  }
};

//# The App Instance
this.Kodi = (function(Backbone, Marionette) {

  const App = new Backbone.Marionette.Application();

  App.addRegions({
    root: "body"});

  //# Load custom config settings.
  App.on("before:start", () => config.static = _.extend(config.static, config.get('app', 'config:local', config.static)));

  App.vent.on("shell:ready", options => {
    return App.startHistory();
  });

  return App;
})(Backbone, Marionette);

$(document).ready(() => {
  // Initialise language support
  return helpers.translate.init(function() {
    // Start the app
    Kodi.start();
    // Start material
    $.material.init();
    // Bind to scroll/resize for redraw trigger
    return helpers.ui.bindOnScrollResize();
  });
});
