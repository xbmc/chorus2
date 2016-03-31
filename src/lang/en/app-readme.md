# Kodi Web Interface - Chorus2
A great modern Web UI for Kodi. Browse your Music, Movies or TV Shows from the comfort of your
own web browser. You can play media via Kodi or stream it in your browser. Works best with Chrome
but plays well with most modern browsers.

Successor to [Chorus](https://github.com/jez500/chorus). 
A complete rebuild using Coffee Script, Backbone, Marionette and much, much more.


## Author
[Jeremy Graham ](http://jez.me) with help from [these kind people](https://github.com/jez500/chorus2/graphs/contributors)


## Current state
Pretty good, most things work really well. Other things need [polish/finishing/fixing](https://github.com/jez500/chorus2/issues). 


## Getting it working
Disclaimer: Pre release software, expect bugs, changes, nuclear war, etc. 

### Installing
Install via zip is the easiest way to go. Grab the zip from the root of this repo [then do this](http://kodi.wiki/view/Add-on_manager#How_to_install_from_a_ZIP_file)

### Configuring
* Kodi > System > Settings > Services
* Remote Control
    * Enable "Allow programs on this system to control Kodi"
    * Enable "Allow programs on other systems to control Kodi"
* Webserver
    * Enable "Allow control of Kodi via HTTP"
    * Select Web interface
    * Select Chorus2


## Feature requests / Bugs
Add them to the [list](https://github.com/jez500/chorus2/issues)


## Streaming 
Disclaimer: The success of this depends on the file formats vs what the browser supports.  In general most things work.

### Audio streaming
In the top right there are some tabs, two of them are named Kodi and Local, this is how you toggle what player the UI
is controlling.  In Local mode the logo and accents are pinky-red, In Kodi mode the logo is the Kodi blue. When you 
are in a given mode, actions affect that player, so if you click Play on a track when in Local mode, it will play 
through the browser, likewise, when in Kodi mode all commands are sent to Kodi.  You can also add media to other 
playlists by clicking the menu buttons (three dots vertical) on most media items.

### Video streaming
Video streaming via HTML5 "sort of" works, it really depends on the codec used. An embedded VLC player is also available with better codec support.
This looks like the best we can get until Kodi supports transcoding.
**Chrome users**: Chrome has removed support for vlc/divx plugins so streaming a video requires a [Chrome friendly codec](https://en.wikipedia.org/wiki/HTML5_video#Browser_support).


## Kodi settings via the web interface
You can change most of the settings you would find in Kodi via the settings page in the web interface.
Some settings have been omitted as they require interaction with the GUI and others are just a basic text field with no options.


## Contributing
If you would like to make this project better I would appreciate any help.

### Translations
I only know English so definitely need help with this.  
I also don't know heaps about javascript multilingual stuff but thanks to @mizaki we have a structure ready to go. 
So it should be nice and easy to translate the UI. 

At the moment, there is 3 languages (english,french,german) more can be easily added. 
To contribute, send me a PR on a new branch, or if you don't know git, a link to the language file.

Language Files [here](https://github.com/jez500/chorus2/tree/master/src/lang). 
English is the only real complete translation file so start with that as your base. 

### Compiling
Sass and Grunt are used to compile css and js in the dist folder.
To get your environment setup first install [Bundler](http://bundler.io) and [npm](https://www.npmjs.org/).

* Install required gems with `bundle install`
* Install NodeJs packages with `npm install`
* Run grunt `grunt`

If you are updating (eg. git pull), always do an `npm update` and `bundle update` to ensure all the tools are in the toolbox.
 
### Build
A build will also include translation files.
- Run grunt `grunt build`

## Donate
Are you a fan of Chorus? You can [buy me a beer](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ZCGV976794JHE&lc=AU&item_name=Chorus%20Beer%20Fund&currency_code=AUD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) to say thanks :)

## Screenshots

### Homepage (now playing)
![alt text](https://raw.githubusercontent.com/jez500/chorus2/master/dist/screenshots/now-playing.jpg "Homepage/Now Playing")

### Search results
![alt text](https://raw.githubusercontent.com/jez500/chorus2/master/dist/screenshots/search.jpg "Search")

### Artists
![alt text](https://raw.githubusercontent.com/jez500/chorus2/master/dist/screenshots/artists.jpg "Artists")

![alt text](https://raw.githubusercontent.com/jez500/chorus2/master/dist//screenshots/artist.jpg "Artist")

### Video library
![alt text](https://raw.githubusercontent.com/jez500/chorus2/master/dist/screenshots/tv.jpg "TV")

### Filtering
![alt text](https://raw.githubusercontent.com/jez500/chorus2/master/dist/screenshots/movie.jpg "Movies")

### Settings
![alt text](https://raw.githubusercontent.com/jez500/chorus2/master/dist/screenshots/settings.jpg "Settings")

### Add-ons
![alt text](https://raw.githubusercontent.com/jez500/chorus2/master/dist/screenshots/addons.jpg "Add-ons")