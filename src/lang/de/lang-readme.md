# Übersetzungen

Um die Sprachdateien zu aktualisieren, brauchst du nicht viel über GIT zu wissen.
Diese Seite hilft dir dabei, mit Sprachdateien umzugehen.

## Wo sind die Sprachdateien?

Die Sprachdateien werden an zwei Orten gespeichert. Das Sprachkürzel LANG_CODE 
ist der zweistellige Code für diese Sprache, z.B. en, fr, de, pl, nl.

### Zeichenketten (Strings)

`src/lang/_strings/LANG_CODE.po`

* Das sind die Zeichenketten, die in der Anwendung verwendet werden. Üblicherweise
  wird nur `msgstr` verändert.
* Wenn `msgstr` für die Zeichenkette nicht vorhanden ist, kopier sie von en.po und
  aktualisiere deine Sprachdatei, etwa de.po für Deutsch.

``` 
msgctxt ""
msgid "Select a filter"
msgstr "Filter wählen"
```

### Seiten

`src/lang/LANG_CODE/PAGE.md`

* Das sind die Seiten, die in anderen Sprachen überschrieben werden können.
* Die Seiten sind in [markdown](https://en.wikipedia.org/wiki/Markdown) verfasst.
* Wenn die Datei *PAGE*.md in deiner Sprache nicht vorhanden ist, kopier die aus
  dem en-Ordner und bearbeite sie.
* Mach das bitte nur, wenn du die Seite auch komplett übersetzt.

## Eine neue Sprache hinzufügen

**Beispiel:** Wenn deine Sprache `Deutsch` ist, würde sie das Kürzel (*LANG_KEY*)
`de` haben.

### Sag der Anwendung Bescheid

Die neue Sprache muss jetzt in der Anwendung eingetragen werden. Also trage in die
Datei `/src/js/helpers/translate.js.coffee` die neue Sprache `de: "Deutsch"` in
`getLanguages` ein. (Für Deutsch schon passiert.)

### Ordner- und Dateistruktur von en kopieren

Kopiere die Dateien, die du übersetzen möchtest:

* **Strings:** copy `/src/_strings/en.po` to `/src/_strings/fr.po`
* **Pages:** copy `/src/en/readme.md` to `/src/fr/readme.md`

## Ausprobieren

Um deine Version zu testen, muss ein neue Version (build) erstellt werden,
vielleicht klappt es aber auch ohne, wenn du dich an die vorhandene Struktur 
gehalten hast.

Wenn du **wirklich** deine neue Sprache in der Anwendung mit einer neuen Version
testen möchtest, kannst du:

1. Sicherstellen, dass `nodejs`, `npm` installiert sind
2. `cd /chorus/folder`
3. `npm install` (nur beim ersten Mal)
4. `grunt lang` (das wird nur die Sprachen im Ordner `dist/lang` erneuern)
5. Chorus2 aktualisieren
  
## Rückgriff auf Englisch

Solange `msgid` in deiner `LANG_CODE.po` noch nicht vorhanden sind, wird die
englische Zeichenkette als Standard verwendet. Gleiches gilt für die Seite
`LANG_CODE/PAGE.md`, falls sie vorhanden ist.

## Eine Aktualisierung einreichen

Einen **pull request** [GitHub](https://github.com/jez500/chorus2) von einem
neuen Zweig (fork) aus zu senden, ist der beste Weg.
Aktualisierungen über andere Wege werden aber auch berücksichtigt.
