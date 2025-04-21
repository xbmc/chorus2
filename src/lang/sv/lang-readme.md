# Översättningar

För att uppdatera språkfilerna behöver du bara känna till lite GIT. Den här sidan bör hjälpa till
med strukturen för språkfiler.

## Var finns språkfilerna?

Det finns två ställen där språkfiler lagras. LANG_CODE är den tvåbokstaviga koden
bokstavskoden för det språket. T.ex.: en, sv, fr, de

### Strängar

`src/lang/_strings/LANG_CODE.po`

* Detta är strängar som används i hela programmet. I allmänhet ska du bara uppdatera `msgstr`.
* Om det inte finns någon `msgstr` för strängen, kopiera då från en.po och uppdatera, Eg de.po.
```
msgctxt ””
msgid ”Välj ett filter”
msgstr ”Filter välja”
```

### Sidor

`src/lang/LANG_CODE/PAGE.md`

* Det här är fullständiga sidor som kan åsidosättas med ett annat språk.
* Sidorna är i [markdown](https://en.wikipedia.org/wiki/Markdown).
* Om det inte finns någon *PAGE*.md för ditt språk, kopiera från en-mappen och redigera.
* Skapa bara en *PAGE*.md för en fullständig översättning

## Lägga till ett nytt språk

**Exempel:** Om ditt nya språk är `franska` skulle det ha en *LANG_KEY* av `fr`.

### Berätta för appen om det

Du måste också tala om för programmet att det ska ha det som ett alternativ. Så du redigerar den här filen:
`/src/js/helpers/translate.js.coffee` och lägger till `fr: ”French”` till språken i `getLanguages`

### Duplicera mapp-/filstrukturen för en

Kopiera de filer som du vill ersätta med det nya språket:

* **Strings:** kopiera `/src/_strings/en.po` till `/src/_strings/fr.po` * **Pages:** kopiera `/src/_strings/fr.po` till `/src/_strings/fr.po`
* **Sidor:** kopiera `/src/en/readme.md` till `/src/fr/readme.md` * **Sidor:** kopiera `/src/fr/readme.md` till `/src/fr/readme.md`

## Testning

För att testa måste du göra en build, men om du följer den befintliga strukturen bör du inte behöva göra det.

Om **du** vill testa ditt språk i appen med en build kan du göra följande:

1. Se till att `nodejs`, `npm` är installerade
2. `cd /chorus/mapp`
3. `npm install` (bara första gången)
4. `grunt lang` (detta kommer endast att bygga om språken i mappen `dist/lang`)
5. Uppdatera kören

## Återgång

Översättningar bör fallbacka till engelska om inte `msgid` är inställt i en `LANG_CODE.po`-fil.
Eller om en sida `LANG_CODE/PAGE.md` existerar.

## Skicka in en uppdatering

Skicka en pull request via [GitHub](https://github.com/jez500/chorus2) på en ny gren är det bästa sättet.
Skulle överväga uppdateringar via andra metoder.