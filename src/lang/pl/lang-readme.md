# Tłumaczenia

Mechanizm aktualizacji plików tłumaczeń, wymaga odrobiny wiedzy o działaniu systemu
kontroli wersji GIT. Ta strona zawiera informacje o strukturze plików tłumaczeń.

## Gdzie znajdują się pliki dla danego języka?

Pliki tłumaczeń znadują się w dwóch miejscach. LANG_CODE - dwuliterowy, niepowtarzalny
kod dla każdego języka. Np.: en, fr, de, pl

### Wyrażenia

`src/lang/_strings/LANG_CODE.po`

* Powyższe wyrażenia są używane w całej aplikacji. Należy przetłumaczyć tylko tekst
* znajdujący się w cudzysłowie, za słowem kluczowym `msgstr`.
* W przypadku, gdy brakuje linijki z wyrażeniem `msgstr`, skopiuj ją z pliku en.po 
* i przetłumacz treść w cudzysłowie. Np. pl.po.
``` 
msgctxt ""
msgid "Select a filter"
msgstr "Wybierz filtr"
```

### Strony

`src/lang/LANG_CODE/PAGE.md`

* W tym miejscu znajdują się całe strony, które wymagają tłumaczenia.
* Strony te zostały stworzone w języku znaczników [Markdown](https://pl.wikipedia.org/wiki/Markdown).
* If there is no *PAGE*.md for yor language then copy from the en folder and edit.
* Only create a *PAGE*.md for a full translation

## Dodawanie nowego języka

**Przykład:** If your new language is `French` it would have a *LANG_KEY* of `fr`.

### Poinformuj aplikację o zmianach

You also need to tell the application to have it as an option. So you edit this file:
`/src/js/helpers/translate.js.coffee` and add `fr: "French"` to the languages in `getLanguages`

### Duplicate the folder/file structure of en

Copy the files you want to override with the new language:

* **Strings:** copy `/src/_strings/en.po` to `/src/_strings/fr.po`
* **Pages:** copy `/src/en/readme.md` to `/src/fr/readme.md`

## Testowanie

To test you need to do a build, however if you follow the existing structure you shouldn't need to.

If **do** you want to test your language in the app with a build, you can:

1. Upewnij się, że `nodejs`, `npm` są zainstalowane
2. Przejdź do folderu Chorusa`cd /chorus/folder`
3. Uruchom `npm install` (tylko za pierwszym razem)
4. Wykonaj `grunt lang` (this will rebuild only the languages in the `dist/lang` folder)
5. Odśwież interfejs Chorusa
  
## Działanie awaryjne

Translations should fallback to English unless the `msgid` is set in a `LANG_CODE.po` file. 
Or if a page `LANG_CODE/PAGE.md` exists.

## Przesyłanie aktualizacji

Send a pull request through [GitHub](https://github.com/jez500/chorus2) on a new branch is the best way.
Would consider updates via other methods.
