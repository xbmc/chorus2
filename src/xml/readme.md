Why is there two addon.xml files in this folder?
================================================

This aids development by allowing interchanging between 2 different addon ids. The release addon
id is `webinterface.default` and the development addon id is `webinterface.defaultdev`. This means
you can have the development code unaffected by Kodi updates as it can live in a user folder.

This works well if you symlink the `dist` folder to `webinterface.defaultdev` in the user addons folder.
It lives next to the userdata folder which can be found here: http://kodi.wiki/view/userdata

Eg. `ln -s ~/repos/chorus2/dist ~/.kodi/addons/webinterface.defaultdev`

Toggling the xml in the dist folder can be done using `build.sh`.

* To activate the development addon.xml run `./build.sh dev`
* When a release build is created addon.xml gets reverted back. Eg `./build.xml 2.5.0` where 2.5.0 is the version number.

NOTE:

* When committing any changes to `dist/addon.xml` it should always be the release version with the id `webinterface.default`
* Each time `build.sh` is run it will replace `dist/addon.xml` with the appropriate version so any changes to `dist/addon.xml` should be done to `src/addon.release.xml`
