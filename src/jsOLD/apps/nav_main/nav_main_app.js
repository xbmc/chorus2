/**
 * NavMain
 */
app.NavMain = {Object: {}, View: {}};

/**
 * The navigation object, this could be a collection
 * but using an object for simplicity for now.
 */
app.NavMain.Object = Marionette.Object.extend({

  structureDefault: [
    {
      title: 'Music',
      path: '#music',
      icon: 'mdi-av-my-library-music',
      classes: 'nav-music',
      children: [
        {
          title: 'Artists',
          path: '#',
          icon: ''
        },
        {
          title: 'Recently Added',
          path: '#',
          icon: ''
        },
        {
          title: 'Recently Played',
          path: '#',
          icon: ''
        },
        {
          title: 'Genres',
          path: '#',
          icon: ''
        },
        {
          title: 'Years',
          path: '#',
          icon: ''
        }
      ]
    },
    {
      title: 'Movies',
      path: '#movies',
      icon: 'mdi-av-movie',
      classes: 'nav-movies',
      children: [
        {
          title: 'Recently Added',
          path: '#',
          icon: ''
        },
        {
          title: 'All',
          path: '#',
          icon: ''
        },
        {
          title: 'Genres',
          path: '#',
          icon: ''
        },
        {
          title: 'Years',
          path: '#',
          icon: ''
        }
      ]
    },
    {
      title: 'TV Shows',
      path: '#tv',
      icon: 'mdi-hardware-tv',
      classes: 'nav-tv-shows',
      children: [
        {
          title: 'Recently Added',
          path: '#',
          icon: ''
        },
        {
          title: 'All',
          path: '#',
          icon: ''
        },
        {
          title: 'Genres',
          path: '#',
          icon: ''
        },
        {
          title: 'Years',
          path: '#',
          icon: ''
        }
      ]
    },
    {
      title: 'Browser',
      path: '#browser',
      icon: 'mdi-action-view-list',
      classes: 'nav-browser',
      children: [
        {
          title: 'Files',
          path: '#',
          icon: ''
        },
        {
          title: 'AddOns',
          path: '#',
          icon: ''
        }
      ]
    },
    {
      title: 'Thumbs Up',
      path: '#thumbsup',
      icon: 'mdi-action-thumb-up',
      classes: 'nav-thumbs-up'
    }
  ],

  /**
   * Returns the menu structure.
   *
   * Starts with default structure and modifies as per user config.
   */
  getStructure: function() {
    // Get default structure.
    var structure = Marionette.getOption(this, "structureDefault");
    // Return final structure.
    return {tree: structure};
  }

});
