# Chorus 2.0 - interfejs webowy Kodi
Domyślny interfejs webowy dla Kodi.

Nowoczesny webowy interfejs użytkownika dla programu Kodi. Umożliwia komfortowe przeglądanie biblioteki
Muzyki, Filmów i Seriali przy pomocy przeglądarki internetowej.
Umożliwia odtwarzanie mediów bezpośrednio w Kodi lub ich transmisję do przeglądarki.
Odtwarzanie transmitowanych mediów najlepiej działa w przeglądarce Chrome, aczkolwiek
nie powinno być żadnych problemów z większością nowoczesnych przeglądarek.

Godny następca poprzedniej wersji [Chorusa](https://github.com/jez500/chorus).
Kompletnie przebudowany, bazujący na bibliotekach Coffee Script, Backbone, Marionette i innych.


## Autor
[Jeremy Graham](http://jez.me) z pomocą [tych osób](https://github.com/xbmc/chorus2/graphs/contributors)


## Aktualny stan
Prace na dodatkiem są zaawansowane, większość rzeczy działa poprawnie. Pozostałe funkcje wymagają jeszcze [odrobiny pracy](https://github.com/xbmc/chorus2/issues).


## Uruchomienie interfejsu
Zastrzeżenie: Oprogramowanie w fazie beta, możliwe błędy, zmiany, wojna nuklearna, etc.

### Instalowanie
Instalacja przy pomocy pliku ZIP jest najprostszym rozwiązaniem. Pobierz najnowszą wersję dodatku ze [strony wydań](https://github.com/xbmc/chorus2/releases) i zainstaluj go [w opisany sposób](http://kodi.wiki/view/Add-on_manager#How_to_install_from_a_ZIP_file)

### Konfiguracja
* Kodi > System > Ustawienia > Usługi
* Sterowanie
    * Aktywuj opcję "Zezwalaj lokalnym programom na sterowanie aplikacją"
    * Aktywuj opcję "Zezwalaj zdalnym programom na sterowanie aplikacją"
* Serwer WWW
    * Aktywuj opcję "Zezwalaj na zdalne sterowanie przez HTTP"
    * Wybierz "Interfejs webowy"
    * Wybierz "Chorus"


## Błędy / Funkcjonalności
Dodaj je do aktualnej [listy zagadnień](https://github.com/xbmc/chorus2/issues)


## Transmitowanie
Zastrzeżenie: Powodzenie odtwarzania zależy od wspieranych przez przeglądarkę formatów plików.
W większości przypadków nie powinno być z tym żadnych problemów.

### Transmisja dźwięku
W prawym górnym roku znajdują się różne zakładki, w tym dwie o nazwie Kodi i Lokalnie, które służą do przełączania
się między odtwarzaniem mediów w Kodi i przeglądarce. W trybie Lokalnie logo i etykieta są w kolorze wiśniowym, a
w trybie Kodi niebieskie. W poszczególnych trybach wykonywane operacje przekazywane są do aktualnego odtwarzacza,
więc naciśnięcie przycisku Odtwarzaj w trybie Lokalnie, spowoduje rozpoczęcie odtwarzania w przeglądarce. Podobnie
sprawa wygląda z trybem Kodi, w którym naciśnięcie przycisku Odtwarzaj spowoduje rozpoczęcie odtwarzania w Kodi.
Isnieje także możliwość, dla większości typów mediów, dodania ich do innych list odtwarzania, za pomocą przycisków
dostępnych po wybraniu odpowiedniego menu na pasku odtwarzacza (trzy pionowe kropki).


### Transmisja wideo
Odtwarzanie transmisji wideo przy pomocy HTML5 "prawie działa", tak naprawdę wszystko zależy od użytego kodeka.
Dodatkowe możliwości oferuje wtyczka odtwarzacza VLC, który posiada lepszą obsługę kodeków.
Do czasu dodania do Kodi funkcji transkodowania, jest to wszystko co można uzyskać.
**Użytkownicy Chrome**: Z przeglądarki Chrome usunięto obsługę wtyczek VLC/DivX, więc transmisja wideo wymaga
kodeka obsługiwanego przez [Chrome](https://en.wikipedia.org/wiki/HTML5_video#Browser_support).


## Konfiguracja Kodi przy pomocy interfejsu webowego
Możesz zmienić większość ustawień Kodi za pomocą dedykowanej strony ustawień w interfejsie webowym.
Niektórych ustawień może brakować, gdyż wymagają one interacji użytkownika w natywnym interfejsie Kodi,
inne natomiast, są tylko podstawowymi polami tekstowymi, bez żadnych dostępnych opcji.


## Współudział
Jeśli chciałbyś wesprzeć rozwoju projektu, będę wdzięczny za każdą pomoc.
Pamiętaj proszę, aby modyfikacje kodu, dodawane za pomocą Pull Request, znajdowany się w gałęzi `develop`.

### Tłumaczenia
Znam tylko język angielski, więc niezbędna będzie Wasza pomoc przy tłumaczeniu.
Mimo, że nie wiem wszystkiego na temat obsługi języków przez JavaScript, to dzięki pomocy @mizaki mamy gotowe mechanizmy obsługi
wielu języków. Z tego powodu, tłumaczenie interfejsu użytkownika nie powinno nastręczać problemów.

Aktualnie dostępne są tłumaczenia dla 5 języków (angielskiego, francuskiego, niemieckiego, holenderskiego, chińskiego), ale nowe
mogą zostać z łatwością dodane. Jeśli chcesz dodać własne tłumaczenie, stwórz dla niego nową gałąź, a następnie skorzystaj
z funkcji Pull Request do gałęzi `develop`. Jeśli nie potrafisz posługiwać się GITem, prześlij mi łącze do plików z tłumaczeniem.

Pliki tłumaczeń są dostępne [tutaj](https://github.com/xbmc/chorus2/tree/master/src/lang). 
Pliki języka angielskiego są jedynymi kompletnymi źródłami, które powinieneś używać w trakcie tłumaczenia na inny język.

### Kompilowanie
Do kompilowania arkuszy CSS i skryptów JavaScript, w ramach dystrybucji, używane są Sass i Grunt.
W celu skonfigurowania swojego środowiska wymagana jest instalacja [Bundlera](http://bundler.io) i [npm](https://www.npmjs.org/).

* Zainstaluj wymagane gemy za pomocą `bundle install`
* Zainstaluj pakiety NodeJs za pomocą `npm install`
* Uruchom Grunta poleceniem `grunt`

W przypadku aktualizacji kodu (np. git pull), zawsze uruchamiaj `npm update` i `bundle update`, aby mieć pewność, że wszystkie
narzędzia znajdują się w przyborniku.
 
### Budowanie
Wynik budowania zawiera także pliki tłumaczeń.
- Uruchom budowanie poleceniem `grunt build`

## Wsparcie
Jesteś fanem Chorusa? Możesz [zasponsorować](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ZCGV976794JHE&lc=AU&item_name=Chorus%20Beer%20Fund&currency_code=AUD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) Jeremy'iemu piwo, aby okazać swoją wdzięczność. :)

## Zrzuty ekranu

### Strona startowa (Teraz odtwarzane)
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/now-playing.jpg "Homepage/Now Playing")

### Wyniki wyszukiwania
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/search.jpg "Search")

### Wykonawcy
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/artists.jpg "Artists")

![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist//screenshots/artist.jpg "Artist")

### Biblioteka wideo
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/tv.jpg "TV")

### Filtrowanie
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/movie.jpg "Movies")

### Ustawienia
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/settings.jpg "Settings")

### Dodatki
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/addons.jpg "Add-ons")
