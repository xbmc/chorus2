# Tangentbindningar

Du kan använda ditt tangentbord för att styra Kodi, detta är standardinställningen men du kan ändra vad
tangentbordet kontrollerar på [inställningssidan](#inställningar/webb). De tillgängliga alternativen är:

## Kodi

Tangentbordet styr Kodi och standardinteraktion med webbläsaren är inaktiverad.
(t.ex. använda upp- och nedpilarna för att bläddra på en sida). [Webbläsarkommando] = [Kodi-åtgärd].

```
Markör VÄNSTER = riktning VÄNSTER
Markör HÖGER = riktning HÖGER
Markör UPP = riktning UPP
Markör DOWN = riktning DOWN
BACKSTEG = Tillbaka
ENTER = Välj
TABB = Stäng
MELLANSLAG = Spela/pausa
Tangent ”C” = Kontextmeny
Tangent ”+” = Volym upp
Tangent ”-” = Volym ned
Tangent ”M” = Ljud av
Tangent ”X” = Stopp
Tangent ”T” = Växla mellan undertexter
Tangent ”>” = Spela upp nästa
Tangent ”<” = Spela upp föregående
Tangent ”\” = Helskärm
Tangent ”O” = Skärmvisning
```

[Har du förbättringar att lägga till? Klicka här](https://github.com/xbmc/chorus2/blob/master/src/js/apps/input/input_app.js.coffee)

## Webbläsare

Tangentbordet styr endast webbläsaren. När [remote](#remote) är öppen styr tangenterna endast Kodi.

## Båda

Tangentbordskommandon utförs i Kodi och i webbläsaren. När [remote](#remote) är öppen styr tangenterna endast
endast styra Kodi. OBS: Många kommandon delas av både webbläsaren och Kodi. T.ex. Backspace.