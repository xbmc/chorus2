# Tłumaczenia

Mechanizm aktualizacji plików tłumaczeń, wymaga odrobiny wiedzy na temat systemu
kontroli wersji GIT. Ta strona zawiera informacje o strukturze plików tłumaczeń.

## Gdzie znajdują się pliki dla danego języka?

Pliki tłumaczeń znajdują się w dwóch miejscach. LANG_CODE - dwuliterowy, niepowtarzalny
kod dla każdego języka. Np.: en, fr, de, pl

### Wyrażenia

`src/lang/_strings/LANG_CODE.po`

* Powyższe wyrażenia są używane w całej aplikacji. Należy przetłumaczyć tylko tekst
znajdujący się w cudzysłowie, za słowem kluczowym `msgstr`.
* W przypadku, gdy brakuje linijki z wyrażeniem `msgstr`, skopiuj ją z pliku en.po 
i przetłumacz treść w cudzysłowie. Np. pl.po.
``` 
msgctxt ""
msgid "Select a filter"
msgstr "Wybierz filtr"
```

### Strony

`src/lang/LANG_CODE/PAGE.md`

* W tym miejscu znajdują się całe strony, które wymagają tłumaczenia.
* Strony te zostały stworzone w języku znaczników [Markdown](https://pl.wikipedia.org/wiki/Markdown).
* W przypadku, gdy nie istnieje jeszcze strona *PAGE*.md dla Twojego języka, to należy ją skopiować
z folderu `en`, a następnie zmodyfikować.
* Twórz tylko strony *PAGE*.md dla kompleksowych tłumaczeń

## Dodawanie nowego języka

**Przykład:** Jeśli nowym językiem tłumaczenia jest język `polski` to jego *LANG_CODE* jest równy `pl`.

### Poinformuj aplikację o zmianach

Wymagane jest poinformowanie aplikacji o dostępności nowego języka. W tym celu musisz
zmodyfikować plik `/src/js/helpers/translate.js.coffee` i dodać `pl: "Polski"` do listy
języków w funkcji `getLanguages`.

### Powielanie struktury folderu/plików z języka angielskiego

Skopiuj pliki, które chcesz przetłumaczyć na nowy język:

* **Wyrażenia:** skopiuj `/src/_strings/en.po` do `/src/_strings/pl.po`
* **Strony:** skopiuj `/src/en/readme.md` do `/src/pl/readme.md`

## Testowanie

Testowanie zmiany wymaga zbudowania aplikacji, aczkolwiek w przypadku postępowania w ramach
istniejącej struktury, nie powinno to być potrzebne.

Jeśli naprawdę chcesz przetestować zmiany w aplikacji, możesz to zrobić następująco:

1. Upewnij się, że `nodejs`, `npm` są zainstalowane
2. Przejdź do folderu Chorusa`cd /chorus/folder`
3. Uruchom `npm install` (tylko za pierwszym razem)
4. Wykonaj `grunt lang` (to polecenie przebuduje tylko tłumaczenia w folderze `dist/lang`)
5. Odśwież interfejs Chorusa
  
## Działanie awaryjne

Mechanizm obsługi języków powinien awaryjnie wyświetlać wyrażenia w języku angielskim
chyba, że w pliku dla aktywnego języka znajduje się już wyrażenie dla danego `msgid`
albo strona dla danego kodu języka `LANG_CODE/PAGE.md` istnieje.

## Przesyłanie aktualizacji

Najlepszym sposobem na przesłanie aktualizacji, jest wykorzystanie funkcji Pull Request, dla zmianach
znajdujących się w dedykowanej gałęzi repozytorium [GitHuba](https://github.com/jez500/chorus2).
Aczkolwiek dopuszczam przesyłanie aktualizacji za pomocą innych metod, np. łączą do plików z tłumaczeniem.

