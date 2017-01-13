# Obsługa dodatków

Chorus obsługuje dodatki, ale tylko na poziomie podstawowym. Każdy dodatek działa nieco inaczej, więc nie wszystkie
funkcje będą dostępne. Na stronie [Dodatki](#addons/all) widoczna jest lista dodatków wykonywalnych oraz dodatków, które 
udostępniają muzykę/wideo (np. YouTube). Dostęp do dodatków, widocznych na tej liście, można uzyskać za pośrednictwem
[przeglądarki](#browser).

## Wyszukiwanie zawartości dodatków

Po instalacji Kodi, Chorus zawiera wyszukiwanie zawartości dla niektórych popularniejszy dodatków, co umożliwia
przeszukiwanie zawartości dodatków za pomocą strony wyszukiwania. Dla przykładu, możesz wprowadzić wyrażenie
"szalone koty" w polu wyszukiwania, nacisnąć "YouTube", aby pobrać listę odnalezionych materiałów w serwisie YouTube.

Jeśli chciałbyś przeszukiwać zawartość udostępnianą przez dodatki, które nie są zawarte w Chorusie, możesz dodać
swoją własną [metodę wyszukiwania](#settings/search) dla wybranego dodatku, która poinformuje Chorusa, jak przeszukiwać zawartość
przez niego udostępnianą.

W celu dodania niestandardowego wyszukiwania, musisz znać postać adresu URL używanego wewnętrznie przez dodatek, który służy
do dostarczania wyników wyszukiwania. To nie zawsze jest proste ani oczywiste i może wiązać się z analizą kodu dodatku lub pliku
dziennika Kodi, aby określi poprawny format adresu URL. Przy czym Chorus zastąpi wzorzec `[QUERY]` szukanym wyrażeniem.

### Przykłady adresów URL przeszukiwania zawartości dodatków

* YouTube: `plugin://plugin.video.youtube/search/?q=[QUERY]`
* SoundCloud: `plugin://plugin.audio.soundcloud/search/query/?q=[QUERY]`
* Radio: `plugin://plugin.audio.radio_de/stations/search/[QUERY]`
* MixCloud: `plugin://plugin.audio.mixcloud/?mode=30&key=cloudcast&offset=0&query=[QUERY]`

### Współudział

Jeśli znasz jakiś dobry dodatek, którego można użyć do wyszukiwania zawartości i uważasz, że powinien być dostępny razem
z instalacją Kodi, powinieneś rozważyć przesłanie modyfikacji kodu za pomocą funkcji [Pull Request](https://github.com/xbmc/chorus2/pulls).
Przyjrzyj się [modułowi SoundCloud](https://github.com/xbmc/chorus2/blob/master/src/js/apps/addon/soundcloud/addon_soundcloud_app.js.coffee) jako przykład struktury kodu.
UWAGA: Tylko dodatki z oficjalnego repozytorium zostaną zaakceptowane.

## Zarządzanie dodatkami

Chorus udostępnia [stronę ustawień](#settings/addons) umożliwiającą aktywację i dezaktywację dodatków, ale pamiętaj, że dezaktywacja
pewnych dodatków może mieć niekorzystne skutki, więc używaj tej funkcji z ostrożnością.

## Znane problemy i ograniczenia

Zaobserwowano kilka problemów związanych z używanie dodatków w Chorusie

* Nie można pobrać zawartości dodatku.
* Zawartość dodatku można odtwarzać tylko w Kodi, nie można jej transmitować to przeglądarki.
* Rezultatem dodania pojedynczej zawartości dodatku do listy odtwarzania, często jest pozycja o dziwnym lub brakującym
  tytule. Przy czym dodawanie zawartości folderów dodatku do listy odtwarzania  wydaje się działać poprawnie. Stąd wniosek,
  że jest to jakiś problem z interfejsem programistycznym Kodi.
* Niektóre dodatki w ogóle nie działają, w takich przypadkach należy zgłosić to autorowi dodatku.
