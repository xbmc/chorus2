# Kodi webbgränssnitt - Chorus2
Standardwebbgränssnittet för Kodi.

Ett fantastiskt modernt webbgränssnitt för Kodi. Bläddra bland din musik, filmer eller TV-program från bekvämligheten av din
egen webbläsare. Du kan spela upp media via Kodi eller streama det i din webbläsare. Fungerar bäst med Chrome
men fungerar bra med de flesta moderna webbläsare.

Efterföljare till [Chorus](https://github.com/jez500/chorus).
En fullständig ombyggnad med hjälp av Coffee Script, Backbone, Marionette och mycket, mycket mer.


## Författare
[Jeremy Graham](http://jez.me) med hjälp av [dessa vänliga människor](https://github.com/xbmc/chorus2/graphs/contributors)


## Nuvarande tillstånd
Ganska bra, det mesta fungerar riktigt bra. Andra saker behöver [poleras/avslutas/rättas till](https://github.com/xbmc/chorus2/issues).
Betraktas fortfarande som beta-programvara, förvänta dig buggar, ändringar, kärnvapenkrig etc.

## Att få det att fungera
Från och med Kodi v17 kommer Chorus2 förinstallerat ur lådan, du behöver bara aktivera det och kryssa i några rutor.

### Aktivering och konfiguration
Kodi > Inställningar (kogg) > Tjänster > Kontroll

* Aktivera ”Tillåt kontroll av Kodi via HTTP”
* Välj webbgränssnitt
* Välj ”Kodis webbgränssnitt - Chorus2”
* Aktivera ”Tillåt program på det här systemet att styra Kodi”
* Aktivera ”Tillåt program på andra system att styra Kodi”

**Av säkerhetsskäl bör du ange ett användarnamn och lösenord för att förhindra obehörig åtkomst**

### Manuell installation
För Kodi v16 och lägre eller om du vill få den senaste versionen ASAP, är en installation via zip det enklaste sättet att gå. Ta tag i den
senaste versionen av `webinterface.default.2.X.X.zip` från [release-sidan](https://github.com/xbmc/chorus2/releases) sedan
installera det [så här](http://kodi.wiki/view/Add-on_manager#How_to_install_from_a_ZIP_file). **NOTE:** Chorus2 är avsedd att användas
användas med den senaste versionen av Kodi och vissa (eller alla) saker kanske inte fungerar i äldre versioner på grund av API-förändringar.

### Använda det
Rikta din webbläsare mot `http://localhost:8080` - ersätt `localhost` med din IP-adress om du använder den på distans och om
om du har ändrat din port till något annat än `8080`, se till att ändra det också. Mer information och avancerad
användning kan hittas på [Kodi Wiki page](http://kodi.wiki/view/Web_interface).

## Funktionsförfrågningar / buggar
Lägg till dem i [listan](https://github.com/xbmc/chorus2/issues). För buggar, vänligen inkludera Kodi-version, webbläsarversion,
Chorus-version och eventuella fel som visas i konsolen. För funktionsförfrågningar, kolla in API-webbläsaren för att se om din
begäran för närvarande är möjlig.


## Streaming
Friskrivningsklausul: Framgången för detta beror på filformaten kontra vad webbläsaren stöder.  I allmänhet fungerar det mesta.

### Ljudströmning
Längst upp till höger finns det några flikar, två av dem heter Kodi och Local, det är så du växlar vilken spelare användargränssnittet
kontrollerar.  I lokalt läge är logotypen och accenterna rosa-röda, i Kodi-läge är logotypen Kodi-blå. När du
är i ett visst läge påverkar åtgärder den spelaren, så om du klickar på Spela på ett spår när du är i lokalt läge, kommer det att spela
genom webbläsaren, på samma sätt skickas alla kommandon till Kodi när du är i Kodi-läge.  Du kan också lägga till media i andra
spellistor genom att klicka på menyknapparna (tre vertikala prickar) på de flesta medieobjekt.

### Videostreaming
Videostreaming via HTML5 fungerar ”på sätt och vis”, det beror på vilken kodek som används. En inbäddad VLC-spelare finns också tillgänglig med bättre stöd för kodek.
Detta ser ut som det bästa vi kan få tills Kodi stöder transkodning.
**Chrome-användare**: Chrome har tagit bort stödet för tillägg för vlc/divx så att strömma en video kräver en [Chrome-vänlig kodek] (https://en.wikipedia.org/wiki/HTML5_video#Browser_support).
För bästa resultat använder du Chrome med mp4-video som har 2-kanalsljud (5.1-ljud verkar inte fungera).

## Kodi-inställningar via webbgränssnittet
Du kan ändra de flesta inställningar som du hittar i Kodi via inställningssidan i webbgränssnittet.
Vissa inställningar har utelämnats eftersom de kräver interaktion med GUI och andra är bara ett grundläggande textfält utan alternativ.

## Kodis API-webbläsare
Det finns en dold funktion i Chorus som gör att du kan leka med Kodi API och se vad som är möjligt via JSON-RPC
gränssnittet. Om du bygger en app eller ett tillägg som använder API kan detta vara super användbart för att både hitta och testa
alla tillgängliga metoder och typer. Om du funderar på en ny funktion för Chorus är det här också ett bra ställe att
testa om det är möjligt (och snabba på utvecklingen genom att lägga till ett fungerande exempel i en fråga). Du kan hitta API-webbläsaren
via ”Chorus Lab” (längst ner till höger 3 vertikala prickar > ”The Lab”) eller direkt via `http://localhost:8080/#lab/api-browser`.

## Att bidra
Om du vill göra det här projektet bättre skulle jag uppskatta all hjälp. Det finns en utvecklingsgren för varje version av
Kodi. Vänligen gör pull requests mot `dev`-grenen för rätt version (ännu bättre om du kan göra en PR för båda).
Leia (v18) dev-grenen är `18.x-dev`, Krypton (v17) dev-grenen är `17.x-dev`. Se även
[dokumentation för utvecklare](https://github.com/xbmc/chorus2/tree/master/src/lang/en/developers.md) för information om hur man
att få igång en utvecklingsmiljö och sedan kompilera projektet med hjälp av docker.

### Översättningar
Jag kan bara engelska så jag behöver definitivt hjälp med det här. Jag vet inte heller så mycket om flerspråkiga JavaScript-grejer, men
tack vare [@mizaki] (https://github.com/mizaki) har vi en struktur som är redo att gå. Så det borde vara trevligt och enkelt att översätta användargränssnittet.

För närvarande finns det [en handfull](https://github.com/xbmc/chorus2/tree/master/src/lang/_strings) språk tillgängliga
men fler kan enkelt läggas till. Fler strängar läggs alltid till så betrakta alltid engelska som sanningskällan.

Så om du ser något på engelska men vill ha det på ditt språk, behöver jag dig! För att bidra, skicka en PR till mig på en ny gren
mot `18.x-dev` och/eller `17.x-dev`, eller om du inte kan git, en länk till språkfilen.

Språkfiler [här](https://github.com/xbmc/chorus2/tree/master/src/lang).
*Engelska är den enda riktiga kompletta översättningsfilen så börja med den som din bas.

## Donera
Är du ett fan av Chorus? Du kan [köpa en öl till Jeremy](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ZCGV976794JHE&lc=AU&item_name=Chorus%20Beer%20Fund&currency_code=AUD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) för att säga tack :)

## Licens

Detta program är fri programvara; du kan vidaredistribuera det och / eller modifiera
det enligt villkoren i GNU General Public License som publiceras av
Free Software Foundation; antingen version 2 av licensen, eller
(efter eget val) någon senare version.

Detta program distribueras i hopp om att det kommer att vara användbart,
men UTAN NÅGON GARANTI; utan ens den underförstådda garantin om
SÄLJBARHET eller LÄMPLIGHET FÖR ETT BESTÄMMT SYFTE.  Se
GNU General Public License för mer information.

Du bör ha fått en kopia av GNU General Public License
[tillsammans med det här programmet](https://github.com/xbmc/chorus2/blob/master/LICENSE);
Om inte, skriv till Free Software Foundation, Inc, 51 Franklin Street,
Fifth Floor, Boston, MA 02110-1301 USA.

[Klicka här för mer information ](https://github.com/xbmc/chorus2/blob/master/src/lang/en/license.md).


## Skärmdumpar

### Hemsida (spelas upp nu)
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/now-playing.jpg ”Hemsida/Nu spelas”)

### Sökresultat
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/search.jpg ”Sök”)

### Artister
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/artists.jpg ”Artister”)

![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist//screenshots/artist.jpg ”Artist”)

### Videobibliotek
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/tv.jpg ”TV”)

### Filtrering
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/movie.jpg ”Filmer”)

### Inställningar
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/settings.jpg ”Inställningar”)

### Tillägg
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/addons.jpg ”Tillägg”)

### Redigera media
![alt text](https://raw.githubusercontent.com/xbmc/chorus2/master/dist/screenshots/edit-media.jpg ”Redigera media”)