Version 2.3.8
-------------
* Replaced imdb and google images with fontawesome icons. Added License documentation #179
* Added the ability to edit and view the library metadata for songs, artists, albums, tvshows, episodes and movies. Solves #102
* Updated API browser to also show types and updated readme re API browser
* Sort albums by year on artist page
* Added season episodes to episode details page
* Improved search UX, added ability to search common addon content (SoundCloud, MixCloud, GoogleMusic, YouTube, Radio)
* Big improvements to search performance
* Added filters to landing page and refined sections
* Updated album and artist details pages to show lots more metadata, improved layout and added action buttons to be more consistent with video pages
* Added random sort to filters for albums, artists, tv and movies. Added ability to set sort via url eg. #music/albums?sort=random
* Added related movies to movie detail page
* Fixed broken images in cast list
* Updated Backbone.RPC to support named params, improved all entity collections to use named params
* Added airdate to episode view
* New and improved landing pages for music, tv and movies with more content to explore #135
* Merged Polish translation update #184

Version 2.3.7
-------------
* Added ability to sort and remove items in local playlists
* Added context link to season from TV episode #169
* Added ability to thumbs up tv episodes
* Added ability to clean audio and video library and add actions to Kodi settings form #177
* Added ability to select multiple items with CTRL+click and perform bulk actions eg. play, queue and add to playlist
* Fixed dropdown menu closing on click #173
* Added Kodi saved and smart playlists to the Chorus browser #167
* Added support for exporting and downloading local playlists to m3u
* Fixed issue with addon enable/disable not saving #162
* String updates and addition of many more translatables that were previously missing
* Merged Polish translation update #166

Version 2.3.6
-------------
* Added filtering by thumbs up to movies, tv, artists and albums
* Fixed bug with newly added thumbs up items not appearing on thumbs up page
* Added ability to show device name as title #98
* Style and UI improvements for movies and TV with focus on watched status
* Movie details page improvements, added mpaa, added ability to toggle watched
* TV details, list, seasons and episodes have all had an overhaul with many bugfixes and improvements
* Added ability to mark watched, queue or play an entire TV series or season #74
* Merged updated French and Polish translations #161 and #160
* Improved play button toggle based on player state #157
* Improved styling in file/addon browser
* Added ability to queue a file/addon media via context menu
* Aligned album song listing columns #37
* Added filtering by year for albums and music
* Fixed browser crashing if virtual list was passed an empty collection

Version 2.3.5
-------------
* Merged German language updates #139
* Merged Lithuanian language updates #141
* Removed some debugging
* Added expert settings level to Kodi settings
* Added sorting of albums by date added #21

Version 2.3.4
-------------
* Fixed bug with playing all songs for an artist via artist page #129
* Improved breadcrumb handling and fixed base path issue with addon browser #125 and #132
* Added setting to toggle visibility of thumbs up action #117
* Fixed issue with help pages not displaying when using a non en language
* Added Chinese translations #130 and #128

Version 2.3.3
-------------
* Added screenshots to addon.xml

Version 2.3.2
-------------
* Updated default backgrounds with CC images

Version 2.3.1
-------------
* Changed build script to use webinterface.default

Version 2.3.0
-------------
* Version bump to be greater than current default web interface

Version 2.0.17
--------------
* Moved to official XBMC/Kodi repo and addon id changed to webinterface.default

Version 2.0.17
--------------
* Bugfix: Fixed mp4 local video playback in chrome.

Version 2.0.15
--------------
* Bugfix: Fixed first playlist item not indicating it's playing after track change #107
* Bugfix: Fixed incorrect section menu displaying on filtered results page #112
* Bugfix: Fixed about link in main context menu
* Bugfix: Focus in text input in modal popup #119
* French language updated #114
* Minor code cleanup

Version 2.0.14
-------------
* Added ability to customise menu links
* de language updates
* Added progress to tvshow and season
* Volume keybind update #91

Version 2.0.13
-------------
* Added video resume UI and functionality #76
* Volume keys fix for non numpad keyboard #83
* Added fullscreen to keymap #94
* Improved key bindings and added docs

Version 2.0.12
-------------
* Improved adding to mobile home screen #79
* Fixed https issue with type #83
* Sort album by artist #84
* Auto scroll to current track #88
* Added keyboard control setting #89

Version 2.0.11
-------------
* String updates

Version 2.0.10
-------------
* Bug fixes and refactoring
* Help improvements and added about page
* Added screenshots to readme
* Dev build improvements

Version 2.0.9
-------------
* String updates

Version 2.0.8
-------------
* Help module with multilingual support and markdown parsing
* Restructure of language files
* Developer build tools improvements
* Fixes and improvements

Version 2.0.7
-------------
* Ability to toggle what addons are enabled
* Fixed back button in file browser #40
* Fixed remote toggle bug #39
* Settings improvements (addon selection)
* Added fanart background to popup video player
* Added bb code formatting to file/addon browser
* Playing a video respects kodi/local context #11
* Info toggles osd when playing #57

Version 2.0.6
-------------
* Improvements to settings browser
* Responsive styles for album listings
* Fixes and improvements

Version 2.0.5
-------------
* Browse and change Kodi settings with your browser

Version 2.0.4
-------------
* Labs
* API browser
* Screenshot

Version 2.0.3
-------------
* File browser style and responsive updates
* Added dutch language #56
* SSL fix for web sockets #54
* Minor updates and fixes

Version 2.0.2
-------------
* Improved search UX to inform user of progress

Version 2.0.1
-------------
* Readme and responsive updates
* Added install zip to repo

Version 2.0.0
-------------
* Majority of build. See: https://github.com/jez500/chorus2/commits/master
