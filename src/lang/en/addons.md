# Add-on Support

Chorus supports add-ons, but at a generic level. As each add-on does things differently, not all functionality will be
available. The [Add-Ons](#addons/all) page lists add-ons that are executable (eg. Global Search) or add-ons that provide
a list of audio/video content (eg. YouTube). Add-ons that provide lists can also be accessed via the [browser](#browser).

## Custom Add-on Search

Out of the box, Chorus includes search functionality for some of the more popular add-ons, this allows you to search
content provided by that add-on via the search page. For example you could type in "crazy cat videos" in the search box
and then on the search page, click "YouTube" to get a list of videos provided by YouTube on that subject.

If you wish to search content provided by an add-on that isn't included with Chorus, you can add your own
[custom add-on search](#settings/search) which tells Chorus how it can search for the content provided by that add-on.

To add a custom search, you need to know what url the add-on is using internally to provide the search results. This
isn't always easy or obvious to find out and may involve looking through the add-on code or kodi logs to determine the
correct url to use. Chorus will substitute the token `[QUERY]` with the search term.

### Examples of add-on search urls

* YouTube: `plugin://plugin.video.youtube/search/?q=[QUERY]`
* SoundCloud: `plugin://plugin.audio.soundcloud/search/query/?q=[QUERY]`
* Radio: `plugin://plugin.audio.radio_de/stations/search/[QUERY]`
* MixCloud: `plugin://plugin.audio.mixcloud/?mode=30&key=cloudcast&offset=0&query=[QUERY]`

### Contributing

If you find a good custom add-on search that should be included in Chorus out of the box then you should consider
submitting a [pull request](https://github.com/xbmc/chorus2/pulls) for it. Look at the [SoundCloud module](https://github.com/xbmc/chorus2/blob/master/src/js/apps/addon/soundcloud/addon_soundcloud_app.js.coffee)
as an example of the code structure. NOTE: Only add-ons that are in the official repository will accepted.

## Enabling and disabling Add-ons

Chorus provides a [settings page](#settings/addons) for enabling and disabling add-ons, be aware that disabling certain
add-ons may have adverse effects so use with care.

## Known issues and limitations

A few things that have been observed with using add-ons in Chorus

* You cannot download add-on content.
* You can only play add-on content via Kodi, it cannot be streamed to the web browser.
* Adding a single add-on media to the playlist often results in the playlist entry having a weird title or missing a
  title altogether. Adding an add-on folder seems to populate it correctly. This appears to be an issue with the Kodi API.
* Some add-ons won't work at all, this should be raised up with the add-on author.
