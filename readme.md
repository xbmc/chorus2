# Kodi Web Interface - Chorus2
The default Web Interface for Kodi.

A great modern Web UI for Kodi. Browse your Music, Movies or TV Shows from the comfort of your
own web browser. You can play media via Kodi or stream it in your browser. Works best with Chrome
but plays well with most modern browsers.

Successor to [Chorus](https://github.com/jez500/chorus). 
A complete rebuild using Coffee Script, Backbone, Marionette and much, much more.


## Author
[Jeremy Graham ](http://jez.me) with help from [these kind people](https://github.com/xbmc/chorus2/graphs/contributors)


## Current state
Pretty good, most things work really well. Other things need [polish/finishing/fixing](https://github.com/xbmc/chorus2/issues). 
Still considered beta software, expect bugs, changes, nuclear war, etc.

## Getting it working
As of Kodi v17, Chorus2 comes pre-installed out of the box, you just need to enable it and tick a few boxes.

### Enabling & Configuring
Kodi > Settings (cog) > Services > Control

* Enable "Allow control of Kodi via HTTP"
* Select Web interface
* Select "Kodi web interface - Chorus2"
* Enable "Allow programs on this system to control Kodi"
* Enable "Allow programs on other systems to control Kodi"

**For security reasons you should set a username and password to prevent unauthorised access**

### Manual install
For Kodi v16 and below or if you want to get the latest version ASAP, an install via zip is the easiest way to go. Grab the
latest release of `webinterface.default.2.X.X.zip` from the [releases page](https://github.com/xbmc/chorus2/releases) then
install it [like this](http://kodi.wiki/view/Add-on_manager#How_to_install_from_a_ZIP_file). **NOTE:** Chorus2 is intended to
be used with the latest version of Kodi and some (or all) things might not work in older versions due to API changes.

### Using it
Point your web browser to `http://localhost:8080` - replace `localhost` with your IP address if using remotely and if
you have changed your port to something other than `8080` be sure to change that too. More information and advanced
usage can be found over on the [Kodi Wiki page](http://kodi.wiki/view/Web_interface).

## Feature requests / Bugs
Add them to the [list](https://github.com/xbmc/chorus2/issues). For bugs please include Kodi version, Web browser version,
Chorus version and any errors that display in the console. For feature requests, checkout the API browser to see if your
request is currently possible.


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
For best results use Chrome with mp4 video that has 2 channel audio (5.1 audio doesn't seem to work).

## Kodi settings via the web interface
You can change most of the settings you would find in Kodi via the settings page in the web interface.
Some settings have been omitted as they require interaction with the GUI and others are just a basic text field with no options.

## Kodi API browser
There is a hidden feature in Chorus that allows you to play with the Kodi API and see what is capable via the JSON-RPC
interface. If you are building an app or addon that uses the API this can be super useful for both finding and testing
all the methods and types available. If you are thinking about a new feature for Chorus, this is also a great place to
test if it is possible (and fast track development by adding a working example to an issue). You can find the API browser
via "Chorus Lab" (bottom right 3 vertical dots > "The Lab") or directly via `http://localhost:8080/#lab/api-browser`.

## Contributing
If you would like to make this project better I would appreciate any help. Please do pull requests against the `develop` branch.
I am happy to assist with getting an development environment up and running if you are happy to contribute.

### Translations
I only know English so definitely need help with this. I also don't know heaps about javascript multilingual stuff but
thanks to [@mizaki](https://github.com/mizaki) we have a structure ready to go. So it should be nice and easy to translate the UI.

At the moment, there are [a handful](https://github.com/xbmc/chorus2/tree/master/src/lang/_strings) of languages available
but more can be easily added. More strings are always being added so always consider english as the source of truth.

So if you see something in english but want it in your language, I need you! To contribute, send me a PR on a new branch
against `develop`, or if you don't know git, a link to the language file.

Language Files [here](https://github.com/xbmc/chorus2/tree/master/src/lang). 
*English is the only real complete translation file so start with that as your base.*

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
Are you a fan of Chorus? You can [buy Jeremy a beer](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ZCGV976794JHE&lc=AU&item_name=Chorus%20Beer%20Fund&currency_code=AUD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) to say thanks :)

## License

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

[Click here for more information ](src/lang/en/license.md).


## Screenshots

### Homepage (now playing)
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/now-playing.jpg "Homepage/Now Playing")

### Search results
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/search.jpg "Search")

### Artists
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/artists.jpg "Artists")

![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist//screenshots/artist.jpg "Artist")

### Video library
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/tv.jpg "TV")

### Filtering
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/movie.jpg "Movies")

### Settings
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/settings.jpg "Settings")

### Add-ons
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/addons.jpg "Add-ons")

### Editing media
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/edit-media.jpg "Editing Media")
