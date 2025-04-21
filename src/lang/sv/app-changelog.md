Version 21.x-1.0.1
-------------
Fixa ordning på översättningsfiler

Version 21.x-1.0.0
-------------
Diverse korrigeringar för Omega Release

Version 19.x-2.4.8
-------------
* Fixade HTML-artefakter vid visning av albumår (@arigit & @nagubal) #439
* Skapa översättning för traditionell kinesiska (zh_hant) (@Cypresslin) #437

Version 19.x-2.4.7
-------------
* Fixade affischer som inte visas för program och filmer i Kodi 19 (@enen92) #392
* Fixat uppdatering av konstverk för filmer och program i Kodi 19 (@enen92) #413
* Fixad spelarsökning i Kodi 19 (@sigmaris) #412
* Byt namn på xbmc.pvrclient till ny kodi.pvrclient för kodi 19 (@AlwinEsch) # 409
* Lägg till slovakisk översättning (@jose1711) #404
* Lägg till alternativ för att sortera efter år (@edgardmessias) #387
* Lägg till kortkommando för 'mute' (@jmbreuer) #388
* Uppdatera jquery till 3.5.1 (@peak3d) #414
* Fixa skrivfel i tjeckisk översättning (@jose1711) #403
* Fixa felaktig referens till ikonfil (@jfly) #401
* Lägg till bevakat filter i filmlistan (@claudetete) #366
* Addon.xml fixar (@kingmdollar enen92) #393 #415
* Lagt till filter efter tagg för filmer och tv-serier (@tazeat) #416
* Fixa musikvideolistan som inte visas (@enen92) #418
* Flera stil- och kodkorrigeringar (främst @rechi)

Version 18.x-2.4.6
-------------
* Lagt till utvecklardokumentation och Dockerfile #331
* Fixar massor av XSS på grund av saknad escaping av HTML-entiteter (CVE-2018-8831), tack @pkerling #340

Version 18.x-2.4.5
-------------
* Fixat problem med att inte kunna visa albumsidan i Kodi Leia (v18) #327
* Uppdaterat versionsschema för att stödja flera versioner av Kodi
* Uppdaterade API-nycklar för externa tjänster, tillåter åsidosättande av API-nyckel #309
* Lägg till OnResume till websockets-meddelanden #328
* Uppdaterade opensans-light-teckensnittsfiler för förbättrat flerspråkigt stöd #297
* Lägg till PAL SD-videostorlek i strömmar #315
* Nya literals och några korrigeringar #317
* Förbättrad kinesisk översättning #321
* Tjeckisk översättning #312
* Portugisisk översättning #304
* Ungerska översättningar #296
* Lägg till stöd för vim-liknande hjkl-rörelseknappar. #278
* Holländsk översättning av keybind-readme.md #279
* Uppdatera pngs med optimerade versioner #263
* Uppdatera fanart med optimerade versioner #263

Version 2.4.4
-------------
* Lagt till år i redigeringsformuläret för film #231
* Lade till ytterligare nycklar 61/173 för vol-kontroll och tog bort fliken från vitlistan #242
* Fixat förloppsfält för media som visas över filterfältet #253
* Åtgärdat problem med att volymen återställdes till 50% vid lokal uppspelning av låtbyte #254 #230 #235
* Tog bort felsökning som spammade konsolen
* Polsk översättning - uppdateringar #249

Version 2.4.3
-------------
* Fixad snabbmeny i webbläsaren #226
* Fixat borttagning av BBcode-taggar i webbläsaren #223
* Lagt till funktionalitet för festläge till lokal webbläsarspelare # 218
* Uppdaterad till senaste Soundmanager2 (297a-20150601)
* Fast val av kodi / lokal / automatisk spelare vid laddning
* Uppdaterad polsk översättning # 227
* Uppdateringar av tyska språket #225

Version 2.4.2
-------------
* Lade till trailerväljare till filmredigeraren
* Lagt till möjlighet att avsluta, stänga av, starta om, avbryta och vila när fjärrströmknappen klickas #28
* Försök att återansluta till websockets efter stängd anslutning #15
* Lagt till möjlighet att välja alla objekt från en uppsättning och utföra åtgärder på objekt #156
* Lagt till tooltip med sändningsdatum för avsnitt i teaser för avsnitt #170
* Lagt till stöd för ChromeCast i lokal videospelare #220
* Ändrat alla videospelarbibliotek till lokala tillgångar, mindre stil- och buggfixar #219
* Volymen kan nu styras via - och =-tangenterna för tangentbord utan numpad #202
* Tog bort cocktail och mixins som inte används #179
* Lagt till externa videor på sidan för musikvideodetaljer
* Lagt till externa uppslagningar för fanarttv och musicbrainz för musikvideofanart och tumme
* Lagt till stöd för musikvideor #217
* Lagt till meddelande om frånkoppling när kodi har avslutats #10
* Uppdaterad polsk översättning # 216

Version 2.4.1
-------------
* Lade till album i sångtabellen # 212
* Mindre regressionsfixar
* Buggfix för filmsida som inte laddas för Kodi v16 # 207
* Lagt till möjlighet att byta namn på spellistor # 55
* Massor av PVR-uppdateringar, förbättrad UX och tillagda inspelningar
* Fixad direktväg till PVR #17
* Fixat fel med epg som inte laddades #211
* Uppdaterade polska översättningar #205 #210
* Uppdaterad licens för Chorus2 till GPL-2+ #179 #208

Version 2.4.0
-------------
* Fixat edge case-bugg när man navigerar bort från stora listor
* Åtgärdat problem med volymfältet som studsar runt efter volförändring
* Säkerställ att alla strängar som använder sprintf är översättningsbara #198
* Lagt till möjlighet att göra tummen upp för aktuellt objekt via spellista
* Om objektet redan finns i spellistan när du klickar på spela, kommer det att spela upp objektet i spellistan snarare än att lägga till det igen
* Åtgärdat fel där du inte kunde spela en enda låt lokalt
* Lagt till möjlighet att göra tummen upp för media från detaljsidan
* Sök artister tittar på alla artister, inte bara albumartister
* Förhindrade flyttning av det objekt som för närvarande spelas upp i spellistan på grund av de negativa effekter det orsakar #196
* Fixa uppspelningsposition efter spellista rensa och lägg sedan till medan objektet fortfarande spelas #195
* Aktiverat att välja objekt med kommandotangenten i osX
* Lagt till en lösning för tillägg och filer som saknar titel och tumme i spellistan
* Lagt till avsnittet ”Toppmusik” för att bläddra bland de mest spelade albumen och låtarna
* Lagt till möjlighet att uppdatera / skrapa filmer, tv och avsnitt
* Lyssna efter medieuppdateringar från Kodi och uppdatera användargränssnittet om det mediet är synligt
* Borttagen extern sökning i theaudiodb
* Förbättringar av renderingsprestanda med stora samlingar, särskilt låtar
* Lagt till avsnitt för att bläddra bland alla musikgenrer, lagt till landningssida per genre med artist/album/låtar i den genren
* Lagt till spansk översättning #194
* Uppdaterad polsk översättning #193
* Stavningskorrigeringar #192
* Ny inställningssida för att lägga till anpassad tilläggssökning till huvudkörsökning
* Uppdateringar av webbläsaren: möjlighet att hämta filer, möjlighet att sortera #188, lagt till mappåtgärder (kö/spela mapp) #131

Version 2.3.9
-------------
* Lagt till Add-on-sektion med möjlighet att bläddra och köra aktiverade tillägg #182
* Uppdaterad och patchad backbone-fetch-cache för att förhindra fel vid modellhämtning när ingen jqXHR-obj
* Lagt till intern, extern och youtube-sökning i kontextuella menyer på sidor med mediadetaljer
* Massor av förbättringar av redigering med förbättrad live-omladdning av enheter vid spara.
* Lagt till rullgardinsmeny med redigeringslänk till alla detaljvyer
* Buggfix - filmsidan laddas inte om det inte finns någon trailer (introducerad i tidigare version)
* Möjlighet att redigera/uppdatera affisch- och fanart-bilder via medieredigeraren
* Lagt till fler länkar till landningssidans sektioner
* Lagt till pågående filter till tv- och filmlistor
* Lagt till labbikonbläddrare i labbet så att du kan se alla körikoner

Version 2.3.8
-------------
* Ersatt imdb och google images med fontawesome-ikoner. Lagt till licensdokumentation #179
* Lagt till möjligheten att redigera och visa bibliotekets metadata för låtar, artister, album, tv-program, avsnitt och filmer. Löser #102
* Uppdaterad API-webbläsare för att också visa typer och uppdaterad readme om API-webbläsare
* Sortera album efter år på artistsidan
* Lagt till säsongsavsnitt på sidan med avsnittdetaljer
* Förbättrad sökning UX, lagt till möjlighet att söka vanligt tilläggsinnehåll (SoundCloud, MixCloud, GoogleMusic, YouTube, Radio)
* Stora förbättringar av sökprestanda
* Lagt till filter på landningssidan och förfinade sektioner
* Uppdaterade sidor med album- och artistinformation för att visa mycket mer metadata, förbättrad layout och tillagda åtgärdsknappar för att vara mer konsekventa med videosidor
* Lagt till slumpmässig sortering i filter för album, artister, tv och filmer. Lagt till möjlighet att ställa in sortering via url, t.ex. #musik/album?sort=slumpmässig
* Lagt till relaterade filmer på sidan med filmdetaljer
* Fixat trasiga bilder i rollistan
* Uppdaterat Backbone.RPC för att stödja namngivna parametrar, förbättrat alla entitetssamlingar för att använda namngivna parametrar
* Lagt till sändningsdatum i avsnittvyn
* Nya och förbättrade landningssidor för musik, tv och film med mer innehåll att utforska #135
* Sammanslagning av uppdatering av polsk översättning #184

Version 2.3.7
-------------
* Lagt till möjlighet att sortera och ta bort objekt i lokala spellistor
* Lagt till kontextlänk till säsong från TV-avsnitt #169
* Lagt till möjlighet att göra tummen upp för tv-episoder
* Lagt till möjlighet att rengöra ljud- och videobibliotek och lägga till åtgärder i Kodi-inställningsformuläret #177
* Lagt till möjlighet att välja flera objekt med CTRL + klicka och utföra bulkåtgärder, t.ex. spela, köa och lägga till i spellistan
* Fast rullgardinsmeny som stängs vid klick #173
* Lagt till Kodi-sparade och smarta spellistor i Chorus-webbläsaren #167
* Lagt till stöd för export och hämtningar av lokala spellistor till m3u
* Fixat problem med att aktivera / inaktivera tillägg inte sparas #162
* Stränguppdateringar och tillägg av många fler översättningsbara som tidigare saknades
* Sammanfogad polsk översättningsuppdatering #166

Version 2.3.6
-------------
* Lagt till filtrering efter tummen upp för filmer, tv, artister och album
* Fixat fel med nyligen tillagda tummen upp-objekt som inte visas på tummen upp-sidan
* Lagt till möjlighet att visa enhetsnamn som titel #98
* Stil- och användargränssnittsförbättringar för filmer och TV med fokus på tittat-status
* Förbättringar av sidan med filmdetaljer, lagt till mpaa, lagt till möjlighet att växla mellan bevakad
* TV-detaljer, lista, säsonger och avsnitt har alla fått en översyn med många buggfixar och förbättringar
* Lagt till möjlighet att markera tittat, köa eller spela en hel TV-serie eller säsong #74
* Sammanfogat uppdaterade franska och polska översättningar #161 och #160
* Förbättrad växling av uppspelningsknapp baserat på spelarens tillstånd #157
* Förbättrad styling i webbläsaren för fil/addon
* Lagt till möjlighet att köa en fil/addon media via snabbmenyn
* Justerade kolumner för album och låtar #37
* Lagt till filtrering efter år för album och musik
* Fixade webbläsarkrasch om virtuell lista skickades till en tom samling

Version 2.3.5
-------------
* Sammanfogade tyska språkuppdateringar #139
* Sammanslagning av litauiska språkuppdateringar #141
* Tog bort viss felsökning
* Lagt till expertinställningsnivå till Kodi-inställningar
* Tillagd sortering av album efter datum tillagd # 21

Version 2.3.4
-------------
* Fixat fel med att spela alla låtar för en artist via artistsidan # 129
* Förbättrad hantering av brödsmulor och fixat problem med basvägen med addon-webbläsare # 125 och # 132
* Lagt till inställning för att växla synlighet för tummen upp-åtgärd # 117
* Åtgärdat problem med hjälpsidor som inte visas när du använder ett språk som inte är en
* Lagt till kinesiska översättningar #130 och #128

Version 2.3.3
-------------
* Lade till skärmdumpar till addon.xml

Version 2.3.2
-------------
* Uppdaterade standardbakgrunder med CC-bilder

Version 2.3.1
-------------
* Ändrat byggskript för att använda webinterface.default

Version 2.3.0
-------------
* Versionsbump ska vara större än nuvarande standardwebbgränssnitt

Version 2.0.17
--------------
* Flyttad till officiell XBMC / Kodi-repo och addon-id ändrat till webinterface.default

Version 2.0.17
--------------
* Buggfix: Fixad mp4 lokal videouppspelning i chrome.

Version 2.0.15
--------------
* Buggfix: Fixat första spellistobjekt som inte indikerar att det spelas efter spårbyte # 107
* Buggfix: Fixat felaktig sektionsmeny som visas på filtrerad resultatsida # 112
* Buggfix: Fixad om länk i huvudkontextmenyn
* Buggfix: Fokus i textinmatning i modal popup #119
* Franska språket uppdaterat #114
* Mindre upprensning av kod

Version 2.0.14
-------------
* Lagt till möjlighet att anpassa menylänkar
* uppdateringar av de språk
* Lagt till framsteg för tv-program och säsong
* Uppdatering av volymnyckelbindning #91

Version 2.0.13
-------------
* Lagt till användargränssnitt och funktionalitet för återupptagning av video #76
* Volymnycklar fixar för tangentbord som inte är numpad # 83
* Lagt till helskärm till keymap # 94
* Förbättrade tangentbindningar och tillagda dokument

Version 2.0.12
-------------
* Förbättrat tillägg till mobil hemskärm #79
* Fixat https-problem med typ #83
* Sortera album efter artist #84
* Automatisk bläddring till aktuellt spår #88
* Lagt till inställning för tangentbordskontroll #89

Version 2.0.11
-------------
* Stränguppdateringar

Version 2.0.10
-------------
* Buggfixar och refaktorisering
* Hjälpförbättringar och tillagd om-sida
* Tillagda skärmdumpar till readme
* Dev bygga förbättringar

Version 2.0.9
-------------
* Stränguppdateringar

Version 2.0.8
-------------
* Hjälpmodul med flerspråksstöd och tolkning av markdown
* Omstrukturering av språkfiler
* Förbättringar av byggverktyg för utvecklare
* Fixar och förbättringar

Version 2.0.7
-------------
* Möjlighet att växla vilka tillägg som är aktiverade
* Fixad bakåtknapp i filbläddraren #40
* Fixat fel med fjärrväxling #39
* Förbättringar av inställningar (val av tillägg)
* Lagt till fanartbakgrund till popup-videospelare
* Lagt till bb-kodformatering i fil / addon-webbläsare
* Att spela en video respekterar kodi / lokalt sammanhang # 11
* Info växlar osd när du spelar # 57

Version 2.0.6
-------------
* Förbättringar av inställningswebbläsaren
* Responsiva stilar för albumlistor
* Fixar och förbättringar

Version 2.0.5
-------------
* Bläddra och ändra Kodi-inställningar med din webbläsare

Version 2.0.4
-------------
* Labb
* API-webbläsare
* Skärmdump

Version 2.0.3
-------------
* Uppdateringar av stil och responsivitet för filwebbläsare
* Tillagt holländskt språk #56
* SSL-fix för webbuttag #54
* Mindre uppdateringar och korrigeringar

Version 2.0.2
-------------
* Förbättrad sök UX för att informera användaren om framsteg

Version 2.0.1
-------------
* Readme och responsiva uppdateringar
* Lade till installations zip till repo

Version 2.0.0
-------------
* Majoriteten av byggandet. Se: https://github.com/jez500/chorus2/commits/master