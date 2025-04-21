# Stöd för tillägg

Chorus stödjer tillägg, men på en generisk nivå. Eftersom varje tillägg gör saker på olika sätt kommer inte all funktionalitet att vara
tillgänglig. På sidan [Tillägg](#addons/all) listas tillägg som är körbara (t.ex. Global sökning) eller tillägg som tillhandahåller
en lista över ljud- och videoinnehåll (t.ex. YouTube). Tillägg som tillhandahåller listor kan också nås via [webbläsare](#browser).

## Sökning efter anpassade tillägg

Chorus innehåller sökfunktioner för några av de mer populära tilläggen, vilket gör att du kan söka efter
innehåll som tillhandahålls av det tillägget via söksidan. Du kan till exempel skriva in ”crazy cat videos” i sökrutan
och sedan på söksidan klicka på ”YouTube” för att få en lista över videor som tillhandahålls av YouTube i det ämnet.

Om du vill söka efter innehåll som tillhandahålls av ett tillägg som inte ingår i Chorus kan du lägga till ett eget
[anpassad tilläggssökning](#settings/search) som talar om för Chorus hur den kan söka efter innehållet som tillhandahålls av det tillägget.

För att lägga till en egen sökning måste du veta vilken webbadress tillägget använder internt för att ge sökresultaten. Detta
är inte alltid lätt eller självklart att ta reda på och kan innebära att man tittar igenom tilläggskoden eller kodi-loggar för att bestämma
korrekt webbadress att använda. Chorus kommer att ersätta token `[QUERY]` med söktermen.

### Exempel på webbadresser för tilläggssökning

* YouTube: Tillägg://plugin.video.youtube/search/?q=[QUERY]`.
* SoundCloud: Tillägg://plugin.audio.soundcloud/search/query/?q=[QUERY]` * Radio: `plugin://plugin.audio.soundcloud/search/?q=[QUERY]`.
* Radio: Tillägg: `plugin://plugin.audio.radio_de/stations/search/[QUERY]`.
* MixCloud: Tillägg: `plugin://plugin.audio.mixcloud/?mode=30&key=cloudcast&offset=0&query=[QUERY]`.

### Att bidra

Om du hittar en bra anpassad tilläggssökning som bör inkluderas i Chorus utan vidare, bör du överväga att
skicka in en [pull request] (https://github.com/xbmc/chorus2/pulls) för den. Titta på [SoundCloud-modulen](https://github.com/xbmc/chorus2/blob/master/src/js/apps/addon/soundcloud/addon_soundcloud_app.js.coffee)
som ett exempel på kodstrukturen. OBS: Endast tillägg som finns i det officiella arkivet kommer att accepteras.

## Aktivera och inaktivera tillägg

Chorus tillhandahåller en [inställningssida](#settings/addons) för att aktivera och inaktivera tillägg, var medveten om att inaktivering av vissa
tillägg kan ha negativa effekter, så använd dem med försiktighet.

## Kända problem och begränsningar

Några saker som har observerats vid användning av tillägg i Chorus

* Du kan inte hämta innehåll från tillägg.
* Du kan bara spela upp tilläggsinnehåll via Kodi, det kan inte strömmas till webbläsaren.
* Att lägga till ett enda tilläggsmedium i spellistan resulterar ofta i att spellistans post har en konstig titel eller saknar en
  titel helt och hållet. Om du lägger till en tilläggsmapp verkar den fyllas i korrekt. Detta verkar vara ett problem med Kodi API.
* Vissa tillägg fungerar inte alls, detta bör tas upp med tilläggsförfattaren.