# Chorus 2.0 - interfejs webowy Kodi
Domyślny interfejs webowy Kodi.

Nowoczesny webowy interfejs użytkownika dla Kodi. Umożliwia komfortowe przeglądanie biblioteki Muzyki,
Filmów i Seriali przy pomocy przeglądarki internetowej.
Umożliwia odtwarzanie mediów bezpośrednio w Kodi lub ich transmisję do przeglądarki.
Odtwarzanie transmitowanych mediów najlepiej działa w przeglądarce Chrome, aczkolwiek
nie powinno być żadnych problemów z większością nowoczesnych przeglądarek.

Godny następca poprzedniej wersji [Chorusa](https://github.com/jez500/chorus).
Kompletnie przebudowany, bazujący na bibliotekach Coffee Script, Backbone, Marionette i innych.


## Autor
[Jeremy Graham](http://jez.me) z pomocą [tych osób](https://github.com/xbmc/chorus2/graphs/contributors)


## Aktualny stan
Całkiem dobry, większość rzeczy działa poprawnie. Inne rzeczy potrzebują [dopracowania/dokończenia/naprawienia](https://github.com/xbmc/chorus2/issues).
Oprogramowanie ciągle w fazie beta, możliwe błędy, zmiany, wojna nuklearna, etc.

## Uruchomienie interfejsu
W przypadku Kodi w wersji 17, Chorus jest dostępny zaraz po zainstalowaniu Kodi, musisz go tylko aktywować i zaznaczyć
kilka opcji.

### Konfiguracja
* Kodi > System > Ustawienia > Usługi

* Aktywuj opcję "Zezwalaj na zdalne sterowanie przez HTTP"
* Wybierz interfejs webowy
* Wybierz "Kodi web interface - Chorus2"
* Aktywuj opcję "Zezwalaj lokalnym programom na sterowanie aplikacją"
* Aktywuj opcję "Zezwalaj zdalnym programom na sterowanie aplikacją"

**Ze względów bezpieczeństwa powinieneś ustawić nazwę użytkownika i hasło, aby zapobiec nieautoryzowanemu dostępowi**

### Instalacja manualna
W przypadku Kodi w wersji 16 i starszych lub gdy chcesz natychmiast korzystać z najnowszej wersji, instalacja
przy pomocy pliku ZIP jest najprostszym rozwiązaniem. Pobierz najnowszą wersję `webinterface.default.2.X.X.zip`
ze [strony wydań](https://github.com/xbmc/chorus2/releases), a następnie zainstaluj ją w [opisany sposób](http://kodi.wiki/view/Add-on_manager#How_to_install_from_a_ZIP_file).
**UWAGA:** Chorus2 jest przeznaczony do używania z najnowszą wersją Kodi i niektóre (lub wszystkie) funkcje,
z powodu zmian w API, mogą nie działać ze starszymi wersjami Kodi.

### Używanie
Skieruj swoją przeglądarkę na adres `http://localhost:8080` - zastąp adres `localhost` adresem zdalnego systemu, jeśli
korzystasz z Kodi na nim zainstalowanego, a w przypadku zmiany domyślnego numeru portu, na inny niż `8080`, zmień
go także. Więcej informacji na ten temat i opis zaawansowanego użycia może znaleźć na [stronach Wiki Kodi](http://kodi.wiki/view/Web_interface).

## Zgłoszenia / Błędy
Dodaj je do aktualnej [listy zagadnień](https://github.com/xbmc/chorus2/issues). Zgłaszając błędy zawrzyj informacje
o wersji Kodi, wersji przeglądarki internetowej, wersji Chorusa i jakiekolwiek błędy pojawiąjące się w konsoli
przeglądarki. Zgłaszając prośby o funkcje, sprawdź w przeglądarce API, czy realizacja Twojej prośby jest w ogóle
możliwa.


## Transmitowanie
Zastrzeżenie: Powodzenie odtwarzania zależy od wspieranych przez przeglądarkę formatów plików.
W większości przypadków nie powinno być z tym żadnych problemów.

### Transmisja dźwięku
W prawym górnym roku znajdują się różne zakładki, w tym dwie o nazwie Kodi i Przeglądarka, które służą do
przełączania się między odtwarzaniem mediów w Kodi i przeglądarce. W trybie Lokalnie logo i etykieta są w kolorze
wiśniowym, a w trybie Kodi niebieskie. W poszczególnych trybach wykonywane operacje przekazywane są do aktualnego
odtwarzacza, więc naciśnięcie przycisku Odtwarzaj w trybie Lokalnie, spowoduje rozpoczęcie odtwarzania w przeglądarce.
Podobnie sprawa wygląda z trybem Kodi, w którym naciśnięcie przycisku Odtwarzaj, spowoduje rozpoczęcie odtwarzania
w Kodi. Istnieje także możliwość, dla większości typów mediów, dodania ich do innych list odtwarzania, za pomocą
przycisków dostępnych po wybraniu odpowiedniego menu na pasku odtwarzacza (trzy pionowe kropki).

### Transmisja wideo
Odtwarzanie transmisji wideo przy pomocy HTML5 "prawie działa", tak naprawdę wszystko zależy od użytego kodeka.
Dodatkowe możliwości oferuje wtyczka odtwarzacza VLC, który posiada lepszą obsługę kodeków.
Do czasu dodania do Kodi funkcji transkodowania, to wszystko co można uzyskać.
**Użytkownicy Chrome**: Z przeglądarki Chrome usunięto obsługę wtyczek VLC/DivX, więc transmisja wideo wymaga
kodeka natywnie obsługiwanego przez [Chrome](https://pl.wikipedia.org/wiki/Audio_i_Video_API#Browser_support).

Najlepszy efekt można uzyskać używając przeglądarki Chrome, w kombinacji z plikami wideo w formacie MP4 i dwukanałową
ścieżką dźwiękową (ścieżki dźwiękowe w formacie 5.1 nie są poprawnie odtwarzane).

## Konfiguracja Kodi przy pomocy interfejsu webowego
Za pomocą dedykowanej strony ustawień w interfejsie webowym, możesz zmienić większość ustawień Kodi.
Niektórych ustawień może brakować, gdyż wymagają one interakcji użytkownika w natywnym interfejsie Kodi,
inne natomiast są tylko podstawowymi polami tekstowymi, bez żadnych dostępnych opcji.

## Przeglądarka API Kodi
W Chorusie istnieje ukryta funkcja, która umożliwia zabawę z interfejsem programistycznym Kodi za pomocą metod
interfejsu JSON-RPC i sprawdzenie co jest możliwe. Jeśli tworzysz aplikację lub dodatek, który korzysta z API, ta
funkcja może się okazać bardzo użyteczna, podczas odkrywania i testowania wszystkich dostępnych metod i typów.
Jeśli myślisz o nowej funkcji Chorusa, przeglądarka API jest idealnym miejscem, aby przetestować czy w ogóle jest
możliwe jej wdrożenie (i umożliwienie szybkiej rozbudowy przez dodanie działające przykładu dla zagadnienia).
Przeglądarkę API odnajdziesz w "Laboratorium Chorusa" (przycisk z trzema kropkami na dolnym pasku) lub bezpośrednio
poprzez skierowanie przeglądarki internetowej na adres `http://localhost:8080/#lab/api-browser`.

## Współudział
Jeśli chciałbyś wesprzeć rozwoju projektu, będę wdzięczny za każdą pomoc.
Pamiętaj, aby modyfikacje kodu dodawane za pomocą funkcji Pull Request, znajdowany się w gałęzi `develop`.
Z przyjemnością pomogę każdemu, kto chciałbym wspomóc mnie w pracach, w uruchomieniu środowiska deweloperskiego.

### Tłumaczenia
Znam tylko język angielski, więc niezbędna będzie Wasza pomoc przy tłumaczeniu.
Mimo, że nie wiem wszystkiego na temat obsługi języków przez JavaScript, to dzięki pomocy @mizaki mamy gotowe mechanizmy
obsługi wielu języków. Z tego powodu, tłumaczenie interfejsu użytkownika nie powinno nastręczać problemów.

Aktualnie dostępne są tłumaczenia dla [kilku](https://github.com/xbmc/chorus2/tree/master/src/lang/_strings) języków, ale
kolejne mogą zostać z łatwością dodane. Kolejne wyrażenia są sukcesywnie dodawane, więc słownik wyrażeń
w języku angielskim, należy traktować jako referencyjne źródło dla tłumaczeń.

Jeśli widzisz coś w języku angielskim, a chciałbyś to zobaczyć w swoim ojczystym języku, potrzebujemy Twojej pomocy!
Jeśli chcesz dodać własne tłumaczenie, stwórz dla niego nową gałąź, a następnie skorzystaj z funkcji Pull Request do gałęzi `develop`.
Jeśli nie potrafisz posługiwać się GITem, prześlij mi łącze do plików z tłumaczeniem.

Pliki tłumaczeń są dostępne [tutaj](https://github.com/xbmc/chorus2/tree/master/src/lang). 
*Pliki języka angielskiego są jedynymi kompletnymi źródłami, które powinieneś używać w trakcie tłumaczenia na swój język.*

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

## Licencja

Ta aplikacja jest darmowym oprogramowaniem; możesz ją dystrybuować
i/lub modyfikować na warunkach Powszechnej Licencji Publicznej GNU
opublikowanej przez Fundację Wolnego Oprogramowania, w wersji
drugiej lub późniejszej.

Ten program jest dystrybuowany w nadziei, że będzie użyteczny,
aczkolwiek BEZ ŻADNEJ GWARANCJI, nawet bez domyślnej gwarancji
HANDLOWEJ lub PRZYDATNOŚCI DLA OKREŚLONEGO CELU. Zapoznaj się
z treścią Powszechnej Licencji Publicznej GNU, aby dowiedzieć
się więcej.

Powinienieś otrzymać kopię Powszechnej Licencji Publicznej GNU
[razem z programem](https://github.com/xbmc/chorus2/blob/master/LICENSE);
jeśli nie, napisz do Fundacji Wolnego Oprogramowania, Inc, na adres
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA

[Naciśnij tutaj, aby dowiedzieć się więcej](https://github.com/xbmc/chorus2/blob/master/src/lang/en/license.md).


## Zrzuty ekranu

### Strona startowa (Teraz odtwarzane)
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/now-playing.jpg "Strona startowa/Teraz odtwarzane")

### Wyniki wyszukiwania
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/search.jpg "Wyszukiwanie")

### Wykonawcy
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/artists.jpg "Wykonawcy")

![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist//screenshots/artist.jpg "Wykonawca")

### Biblioteka wideo
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/tv.jpg "Seriale")

### Filtrowanie
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/movie.jpg "Filmy")

### Ustawienia
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/settings.jpg "Ustawienia")

### Dodatki
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/addons.jpg "Dodatki")

### Edycja mediów
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/edit-media.jpg "Edycja mediów")
