# Translations

To update the language files you just need to know a bit of GIT. This page should help
with the structure of language files.

## Where are the language files?

There are two places where language override files are stored. The LANG_CODE is the two
letter code for that language. Eg: en, fr, de

### Strings

`src/lang/_strings/LANG_CODE.po`

* This is strings used throughout the application. In general, only update `msgstr`.
* If there is no `msgstr` for the string, then copy from en.po and update, Eg de.po.
``` 
msgctxt ""
msgid "Select a filter"
msgstr "Filter wählen"
```

### Pages

`src/lang/LANG_CODE/PAGE.md`

* These are full pages that can be overridden with a different language.
* The pages are in [markdown](https://en.wikipedia.org/wiki/Markdown).
* If there is no *PAGE*.md for yor language then copy from the en folder and edit.
* Only create a *PAGE*.md for a full translation

## If adding a new language

**Example:** If your new language is `French` it would have a *LANG_KEY* of `fr`.

### Tell the app about it

You also need to tell the application to have it as an option. So you edit this file:
`/src/js/helpers/translate.js.coffee` and add `fr: "French"` to the languages in `getLanguages`

### Duplicate the folder/file structure of en

Copy the files you want to override with the new language:

* **Strings:** copy `/src/_strings/en.po` to `/src/_strings/fr.po`
* **Pages:** copy `/src/en/readme.md` to `/src/fr/readme.md`

## Testing

To test you need to do a build, however if you follow the existing structure you shouldn't need to.

If **do** you want to test your language in the app with a build, you can:

1. Ensure `nodejs`, `npm` are installed
2. `cd /chorus/folder`
3. `npm install` (only the first time)
4. `grunt lang` (this will rebuild only the languages in the `dist/lang` folder)
5. Refresh Chorus
  
## Fallback

Translations should fallback to English unless the `msgid` is set in a `LANG_CODE.po` file. 
Or if a page `LANG_CODE/PAGE.md` exists.

## Submitting an update

Send a pull request through [GitHub](https://github.com/jez500/chorus2) on a new branch is the best way.
Would consider updates via other methods.
