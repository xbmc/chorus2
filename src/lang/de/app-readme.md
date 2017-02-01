# Kodi Web Interface - Chorus2

Die Standardoberfläche für die Webansicht von Kodi.

Eine großartige, moderne Weboberfläche für Kodi. Stöbere durch deine Musik, Filme
oder TV-Sendungen - komfortabel mit dem Webbrowser. Du kannst Kodi fernsteuern
oder Medien in deinen Browser streamen. Am Besten funkioniert das mit Chrome, aber
auch gut mit den meisten anderen aktuellen Browsern.

Chorus2 ist der Nachfolger von [Chorus](https://github.com/jez500/chorus).
Von Grund auf neuprogrammiert auf Basis von Coffee Script, Backbone, Marionette 
und vielem, vielem, mehr.


## Autor
[Jeremy Graham ](http://jez.me) mit Hilfe von 
[diesen Typen](https://github.com/xbmc/chorus2/graphs/contributors).


## Aktueller Status
Ziemlich gut, das Meiste funktioniert richtig gut. Anderes braucht noch 
[Politur/Abschluss/Korrektur](https://github.com/xbmc/chorus2/issues).
Es steht beta drauf, also erwarte Fehler, Änderungen, den Atomkrieg usw.

## An's Laufen bekommen
Ab Kodi v17 ist Chorus2 vorinstalliert, du brauchst es nur zu aktvieren und ein
paar Häkchen zu setzen.

### Aktivieren und Einstellen
Kodi > Settings (cog) > Services > Control

* Aktiviere "Allow control of Kodi via HTTP"
* Klicke auf "Web interface"
* Klicke auf "Kodi web interface - Chorus2"
* Aktiviere "Allow programs on this system to control Kodi"
* Aktiviere "Allow programs on other systems to control Kodi"

**Aus Sicherheitsgründen solltest du einen Benutzernamen und ein Passwort
einstellen, um unbefugten Zugriff über die Weboberfläche zu verhinden.**

### Manuelle Installation

Es gibt Gründe, Kodi als zip zu installieren. Etwa, wenn Kodi v16 oder älter ist
oder wenn du direkt die aktuellste Version installieren möchtest. Lade die
aktuellste Version des `webinterface.default.2.X.X.zip` von der 
[Seite mit den Veröffentlichungen](https://github.com/xbmc/chorus2/releases)
herunter, dann installiere es [wie hier beschrieben](http://kodi.wiki/view/Add-on_manager#How_to_install_from_a_ZIP_file). 
**Hinweis:** Chorus2 sollte mit der aktuellsten Version von Kodi benutzt werden,
einiges (oder sogar alles) könnte wegen Änderungen in der API mit älteren Versionen
nicht funktionieren.

### Benutzung

Rufe mit deinem Webbrowser die Adresse `http://localhost:8080` auf - ersetze dabei
`localhost` mit deiner IP-Adresse, wenn du auf einen anderen Rechner zugreifst. Wenn
du einen anderen Port als `8080` eingestellt hast, passe ihn bitte auch an.
Mehr Informationen und Tipps für fortgeschrittene Benutzung ist im 
[Kodi Wiki page](http://kodi.wiki/view/Web_interface) zu finden.

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

## Spenden
Bist du ein Fan von Chorus2 geworden? Du kannst [Jeremy ein Bier kaufen](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ZCGV976794JHE&lc=AU&item_name=Chorus%20Beer%20Fund&currency_code=AUD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted),
um Danke zu sagen. :)

## Lizenz
Chorus2 steht unter der Creative Commons Attribution-Share Alike 3.0 United States License.
[Hier klicken für Informationen.](https://github.com/xbmc/chorus2/blob/master/src/lang/en/license.md)


## Screenshots

### Homepage (Wiedergabe)
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/now-playing.jpg "Homepage/Now Playing")

### Suchergebnisse
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/search.jpg "Search")

### Künstler
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/artists.jpg "Artists")

![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist//screenshots/artist.jpg "Artist")

### Videobibliothek
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/tv.jpg "TV")

### Filterfunktionen
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/movie.jpg "Movies")

### Einstellungen
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/settings.jpg "Settings")

### Erweiterungen
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/addons.jpg "Add-ons")

### Medien bearbeiten
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/edit-media.jpg "Editing Media")
