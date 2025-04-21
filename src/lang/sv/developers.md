# Information till utvecklare

Vill du hjälpa till att göra Chorus ännu bättre? Hitta hjälp nedan...

Den här sidan innehåller information om hur du får igång din utvecklingsmiljö så att du kan bygga och testa dina
förändringar utan att behöva konfigurera alla nödvändiga beroenden.

## Docker dev-miljö

I detta repo ingår en ”Dockerfile” som bygger Chorus 2 dev-miljöavbildningen. Om du vill utveckla
_utan_ att använda docker, är detta en bra referens till vad du behöver installera på din dator.

Om du vill göra ditt liv mycket enklare, installera bara docker och hämta sedan den förbyggda bilden från docker hub.

```
docker pull jez500/chorus2-dev:senaste
```

### Installera dev-beroenden

När du har docker dev-imagen kan du använda den för att utföra alla dina utvecklingsrelaterade uppgifter. Den första av dessa bör
vara att installera alla nodejs/ruby-beroenden.

```
docker run -tiP -v `pwd`:/app jez500/chorus2-dev:latest ./build.sh install
```

Detta kommer att köra `npm install` och `bundle install` inuti dev-containern.

Du bör bara behöva göra detta en gång, om inte... `package.json` eller `Gemfile` är uppdaterade

### Bygga/kompilera projektet

Om du har gjort ändringar i något kaffeskript eller sass kan du bygga dessa ändringar genom att utföra kommandon inuti
dev-containern. För att få en kommandorad i behållaren:

```
docker run -tiP -v `pwd`:/app jez500/chorus2-dev:latest bash
```

När du väl är inne i dev-containern kan du göra följande:

#### Bygga

Detta kommer att bygga språk, dokumentation, js och css.

```
grunt bygga
```

#### Se upp för ändringar (kontinuerligt bygga)

Detta kommer endast att bygga js och css.

```
grunt
```

## Överföra dina ändringar

Som en tumregel bör du inte överföra några kompilerade filer om du inte bygger en release. T.ex. endast commit-filer
i mappen `src`.