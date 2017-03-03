Wersja 2.4.3
-------------
* Naprawiono działanie menu kontekstowego w przeglądarce #226
* Naprawiono wyodrębianie kodu BBcode w przeglądarce #223
* Added party mode functionality to local browser player #218
* Dodano funkcjonalność Trybu Imprezy do odtwarzacza w przeglądarce #218
* Updated to latest Soundmanager2 (297a-20150601)
* Zaktualizowano bibliotekę Soundmanager2 do najnowszej wersji (297a-20150601)
* Naprawiono mechanizm wyboru trybu odtwarzania po wczytaniu
* Zaktualizowano tłumaczenie na język polski #227
* Zaktualizowano tłumaczenie na język niemiecki #225

Wersja 2.4.2
-------------
* Dodano do edytora filmu możliwość wyboru zwiastuna
* Dodano obsługę przyciku Power na pilocie dzięku czemu możliwe jest: Zamknięcie Kodi, Zamknięcie systemu, Uruchomienie ponownie, Uśpienie i Hibernacja #28
* Dodano funkcję ponownego połączenia WebSocket po zerwaniu połączenia #15
* Dodano możliwość zaznaczenia wszystkich pozycji i wykonanie na nich akcji #156
* Dodano do strony informacji o odcinku, pole z datą emisji #170
* Dodano obsługę ChromeCast do funkcji odtwarzania w przeglądarce #220
* Zamieniono biblioteki odtwarzacza wideo na lokalne odpowiedniki, ulepszono wygląd i naprawiono drobne błędy #219
* Dodano możliwość sterowania głośnością przy pomocy klawiszy (- i =), użyteczne w przypadku braku klawiatury numerycznej #202
* Usunięto biblioteki Cocktail i Mixins, które nie są już używane #179
* Dodano zewnętrzne łącza do strony informacji o teledysku
* Dodano możliwość wyszukiwania fototapet i miniatur dla teledysków w serwisach Fanart.tv i MusicBrainz
* Dodano obsługę teledysków #217
* Dodano powiadomienie o rozłączeniu w przypadku zamknięcia programu Kodi #10
* Zaktualizowano tłumaczenie na język polski #216

Wersja 2.4.1
-------------
* Dodano album do tabeli utworu #212
* Naprawiono kilka drobych błędów regresyjnych
* Naprawiono błąd wczytywania strony filmu w Kodi dla wersji 16 #207
* Dodano możliwość zmiany nazwy list odtwarzania #55
* Zaktualizowano sekcję Telewizja, ulepszono interfejs użytkownika i dodano listę nagrań
* Naprawiono ściężkę dostępu do sekcji Telewizja #17
* Naprawiono błąd wczytywania danych przewodnika #211
* Zaktualizowano tłumaczenie na język polski #205 #210
* Zmieniono typ licencji Chorusa na GPL-2+ #179 #208

Wersja 2.4.0
-------------
* Naprawiono rzadki błąd widoczny po opuszczeniu list z dużą ilością pozycji
* Naprawiono błąd powodujący, że pasek głośności podskakiwał, po zmianie poziomu głośności
* Dodano mechanizm gwarantujący, że wszystkie wyrażenia używające funkcji sprintf, mogą zostać przetłumaczone #198
* Dodano możliwość polubienia aktualnie odtwarzanej pozycji na liście odtwarzania
* Naprawiono błąd powodujący ponowne dodanie do listy odtwarzania odtwarzanego utworu, po naciśnięciu na niego
* Naprawiono błąd uniemożliwiający odtwarzanie w przeglądarce pojedynczego utworu
* Dodano możliwość polubienia mediów z poziomu stron informacji
* Ulepszono wyszukiwanie wykonawców tak, aby wyszukiwani byli także wykonawcy utworów, a nie tylko wykonawcy albumów
* Dodano mechanizm zapobiegający przenoszeniu aktualnie odtwarzanej pozycji na liście odtwarzania, ze względu na negatywne skutki jakie to powoduje #196
* Naprawiono pozycjonowanie odtwarzania po wyczyszczeniu listy i dodaniu nowej pozycji, w trakcie odtwarzania poprzedniej pozycji #195
* Dodano możliwość wybierania pozycji przy użyciu klawisza komendy w systemie OSX
* Dodano obejście dla plików i dodatków, z brakującym tytułem i miniaturą, na liście odtwarzania
* Dodano sekcję 'Najlepsza muzyka' umożliwiającą przeglądanie najczęściej odtwarzanych albumów i utworów
* Dodano możliwość odświeżania/pobierania informacji o filmach, serialach i odcinkach
* Dodano mechanizm nasłuchiwania zmian w Kodi i odświeżania interfejsu użytkownika, gdy media są widoczne
* Usunięto zewnętrzne wyszukiwanie w serwisie TheAudioDb
* Ulepszono wydajność renderowania wielkich kolekcji, w szczególności kolekcji utworów
* Dodano sekcję umożliwiającą przeglądanie muzyki po gatunkach, dodano stronę startową dla gatunków muzyki z wykonawcami/albumami/utworami w tym gatunku
* Dodano tłumaczenie na język hiszpański #194
* Zaktualizowano tłumaczenie na język polski #193
* Poprawiono literówki i błędy w pisowni oryginalnej #192
* Dodano nową stronę ustawień, umożliwiającą konfigurację wyszukiwania zawartości dodatków
* Zaktualizowano przeglądarkę: możliwość pobierania plików, możliwość sortowania #188, dodano akcje do folderu (dodanie folderu do kolejki/odtwarzanie zawartości folderu) #131

Wersja 2.3.9
-------------
* Dodano sekcję Dodatki z możliwością przeglądania i uruchamiania aktywnych dodatków #182
* Zaktualizowano i załatano backbone-fetch-cache, w celu uniknięcia błędów podczas pobierania modelu
* Dodano do menu kontekstowego stron informacji o mediach, wyszukiwanie w Chorusie, w Internecie i YouTube
* Dodano wiele ulepszeń do mechanizmu edytowania, wraz z funkcją odświeżania informacji po zapisaniu
* Dodano menu rozwijane, z łączem do edycji, do wszystkich stron informacji o mediach
* Poprawiono błąd na stronie informacji o filmie w przypadku braku zwiastuna (zainicjowany w poprzedniej wersji)
* Dodano możliwości edycji/aktualizacji plakatu i fototapety przy pomocy edytora mediów
* Dodano dodatkowe łącza do stron startowych sekcji
* Dodano przeglądarkę dostępnych ikon w laboratorium Chorusa

Wersja 2.3.8
-------------
* Zastąpiono obrazy IMDb i Google ikonami czcionki Font Awesome. Dodano dokumentację licencyjną #179
* Dodano możliwość edytowania i przeglądania metadanych utworów, wykonawców, albumów, odcinków i filmów. #102
* Zaktualizowano przeglądarkę API, o funkcję wyświetlania typów oraz zaktualizowano jej dokumentację
* Dodano do strony informacji o wykonawcy, sortowanie albumów po latach
* Dodano do strony informacji o odcinku, listę odcinków danego sezonu
* Ulepszono interfejs wyszukiwania, dodano możliwość wyszukiwania zawartości popularnych dodatków (SoundCloud, MixCloud, GoogleMusic, YouTube, Radio)
* Ulepszono znacznie wydajność wyszukiwania
* Dodano filtry do stron startowych sekcji
* Zaktualizowano strony informacji o albumie i wykonawcy o dodatkowe metadane, poprawiano układ interfejsu i dodano przyciski akcji, aby były bardziej spójne ze stronami wideo
* Dodano sortowanie losowe do filtrów w sekcji albumy, wykonawcy, seriale i filmy. Dodano możliwość sortowania za pomocą adresu URL np. #music/albums?sort=random
* Dodano do strony informacji o filmie, łącze do filmów powiązanych
* Naprawiono błędne obrazy na liście obsady
* Zaktualizowano Backbone.RPC o obsługę nazwanych parametrów, ulepszono wszystkie kolekcje encji o nazwane parametry
* Dodano datę pierwszej emisji do strony informacji o odcinku
* Rozbudowano strony startowe, dla sekcji muzyki, seriali i filmów, o dodatkową zawartość #135
* Zaktualizowano tłumaczenie na język polski #184

Wersja 2.3.7
-------------
* Dodano możliwość sortowania i usuwania pozycji w lokalnych listach odtwarzania
* Dodane łącze kontekstowe do sezonu z poziomu odcinka #169
* Dodano możliwość polubienia odcinków serialu
* Dodano możliwość czyszczenia biblioteki wideo i muzyki oraz dodano akcje do formatki ustawień Kodi #177
* Dodano możliwość zaznaczania wielu pozycji za pomocą przycisku CTRL i kliknięcia oraz wykonywania wsadowych akcji np. odtwarzania, kolejkowania i dodawania do listy odtwarzania
* Naprawiono zamykanie się wysuwanego menu po naciśnięciu #173
* Dodano zapisywanie pozycji na listach Kodi oraz funkcję inteligentnych list do przeglądarki Chorusa #167
* Dodano obsługę eksportowania i pobierania lokalnych list odtwarzania jako plik M3U
* Naprawiono problem z zapisywaniem aktywacji/dezaktywacji dodatków #162
* Zaktualizowano plik słownika i dodano możliwość tłumaczenia brakujących wcześniej wyrażeń
* Zaktualizowano tłumaczenie na język polski #166

Wersja 2.3.6
-------------
* Dodano filtrowanie po polubieniach dla filmów, seriali, wykonawców i albumach
* Naprawiono błąd dla nowo polubionych pozycji, które nie pojawiały się na stronie Lubię to!
* Dodano możliwość wyświetlania nazwy urządzenia jako tytułu strony #98
* Ulepszono style i interfejs użytkownika dla funkcji zaznaczania obejrzanych pozycji
* Poprawiono panel informacji o filmie, dodano kategorię wiekową i możliwości przełączenia stanu obejrzenia
* Ulepszono i przebudowano listę oraz panel informacji o serialu, sezonie i odcinku
* Dodano możliwość oznaczenia serialu i sezonu jako obejrzane, a także dodanie ich do kolejki odtwarzania #74
* Dodano aktualne tłumaczenie na język francuski i polski #160 i #161
* Poprawiono działanie przycisku odtwarzania w zależności od stanu odtwarzacza #157
* Poprawiono style w przeglądarce plików/dodatków
* Dodano możliwość dodania za pomocą menu kontekstowego, do kolejki odtwarzania mediów, z poziomu przeglądarki plików/dodatków
* Poprawiono wyrównanie kolumn na liście utworów albumu #37
* Dodano możliwość filtrowania po roku dla albumów i utworów
* Poprawiono błąd powodujący zawieszanie się przeglądarki, w przypadku przekazania do wirtualnej listy - pustej kolekcji

Wersja 2.3.5
-------------
* Zaktualizowano tłumaczenie na język niemiecki #139
* Zaktualizowano tłumaczenie na język litewski #141
* Usunięto część kodu diagnostycznego
* Dodano poziom Ekspercki do ustawień Kodi
* Dodano sortowanie albumów po dacie dodania #21

Wersja 2.3.4
-------------
* Naprawiono błąd odtwarzania wszystkich utworów wykonawcy za pomocą strony wykonawcy #129
* Ulepszono nawigację przy pomocy ścieżki dostępu oraz naprawiono problem z bazową ścieżkę w przeglądarce dodatków #125 i #132
* Dodano opcję umożliwiająca zmianę widoczności przycisku Lubię to! #117
* Naprawiono problem z wyświetlaniem stron pomocy w przypadku używania języka innego niż angielski
* Dodano tłumaczenie na język chiński #130 i #128

Wersja 2.3.3
-------------
* Dodano zrzuty ekranu do definicji dodatku w addon.xml

Wersja 2.3.2
-------------
* Zaktualizowano domyślne tła w oparciu o obrazy na licencji CC

Wersja 2.3.1
-------------
* Zmieniono skrypt budujący tak, aby używał webinterface.default

Wersja 2.3.0
-------------
* Podniesiono numer wersji, aby była wyższa niż aktualna wersja domyślnego interfejsu webowego

Wersja 2.0.17
--------------
* Przeniesiono kod do oficjalnego repozytorium Kodi i zmieniono identyfikator dodatku na webinterface.default

Wersja 2.0.17
--------------
* Poprawiono odtwarzanie transmisji wideo w formacie MP4 w przeglądarce Chrome

Wersja 2.0.15
--------------
* Poprawiono zaznaczenie pierwszej pozycji jako odtwarzana po zmianie ścieżki #107
* Poprawiono wyświetlanie menu sekcji na stronie wyników filtrowania #112
* Poprawiono łącze do Informacji w menu kontekstowym
* Poprawiono zaznaczenie pola tekstowego w oknie dialogowym #119
* Zaktualizowano tłumaczenie na język francuski #114
* Oczyszczono źródła ze zbędnego kodu

Wersja 2.0.14
-------------
* Dodano możliwość personalizacji łączy pozycji menu
* Zaktualizowano tłumaczenie na język niemiecki
* Dodano wskaźnik postępu dla seriali i sezonów
* Zaktualizowano skróty klawiszowe regulacji głośności #91

Wersja 2.0.13
-------------
* Dodano mechanizmy i interfejs dla funkcji wznawiania odtwarzania wideo #76
* Poprawiono skróty klawiszowe regulacji głośności dla klawiatur bez części numeryczne #83
* Dodano skrót klawiszowy dla funkcji przechodzenia w tryb pełnoekranowy  #94
* Ulepszono skróty klawiszowe i dodano dokumentację

Wersja 2.0.12
-------------
* Ulepszono mechanizm dodawania do ekranu startowego urządzeń mobilnych #79
* Naprawiono błąd z komunikacją po HTTPS #83
* Dodano sortowanie albumów wg wykonawcy #84
* Dodano mechanizm przewijania listy do aktualnie odtwarzanej pozycji #88
* Dodano stronę ustawień dla skróty klawiszowe #89

Wersja 2.0.11
-------------
* Zaktualizowano plik słownika wyrażeń

Wersja 2.0.10
-------------
* Naprawiono błędy i przebudowano kod
* Ulepszono strony pomocy i dodano stronę informacji o Chorusie
* Dodano zrzuty ekranu do pliku dokumentacji
* Ulepszono mechanizm budowania

Wersja 2.0.9
-------------
* Zaktualizowano plik słownika wyrażeń

Wersja 2.0.8
-------------
* Dodano obsługę wielu języków do modułu pomocy oraz mechanizm przetwarzania znaczników MD
* Zmieniono strukturę plików tłumaczeń
* Ulepszono narzędzia deweloperskie służące do budowania dodatku
* Dodano drobne poprawki i ulepszenia

Wersja 2.0.7
-------------
* Dodano możliwość aktywacji dodatków
* Naprawiono działanie przycisku Powrót w przeglądarce plików #40
* Naprawiono przełączanie widoczności pilota #39
* Ulepszono stronę ustawień (wybór dodatku)
* Dodano mechanizm wyświetlania fototapety w tle odtwarzacza
* Dodano kod formatujący do przeglądarki plików i dodatków
* Poprawiono odtwarzanie wideo w trybie Kodi i przeglądarki #11
* Poprawiono wyświetlanie menu ekranowego Kodi podczas odtwarzania #57

Wersja 2.0.6
-------------
* Ulepszono przeglądarkę ustawień
* Dodano style mechanizmu skalowania dla listy albumów
* Dodano drobne poprawki i ulepszenia

Wersja 2.0.5
-------------
* Dodano przeglądanie i zmianę ustawień Kodi w przeglądarce

Wersja 2.0.4
-------------
* Dodano stronę Laboratorium
* Dodano stronę Przeglądarka API
* Dodano zrzut ekranu

Wersja 2.0.3
-------------
* Zaktualizowano arkusz stylów i mechanizmy skalowania interfejsu w przeglądarce plików
* Dodano tłumaczenie na język holenderski #56
* Poprawiono połączenia WebSocket w przypadku komunikacji SSL #54
* Poprawiono drobne błędy

Wersja 2.0.2
-------------
* Ulepszono interfejs wyszukiwania o mechanizm informacji o postępie

Wersja 2.0.1
-------------
* Zaktualizowano plik dokumentacji oraz mechanizm skalowania interfejsu
* Dodano instalacyjny plik ZIP dodatku

Wersja 2.0.0
-------------
* Zainicjowano repozytorium . Zobacz: https://github.com/jez500/chorus2/commits/master
