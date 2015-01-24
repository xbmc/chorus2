/**
 * Nav controller.
 */

app.NavMain = {Controller: {}, View: {}};

app.NavMain = Marionette.Application.extend( {

  structureDefault: [
    {
      title: 'Music',
      path: '#',
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
      path: '#',
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
      path: '#',
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
      path: '#',
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
      path: '#',
      icon: 'mdi-action-thumb-up',
      classes: 'nav-thumbs-up'
    }
  ],

  getStructure: function() {
    // Get default structure.
    return {tree: this.structureDefault};
  }

});
