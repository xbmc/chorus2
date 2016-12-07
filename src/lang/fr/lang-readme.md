# Traductions

Pour mettre à jour les fichiers de langue vous devez juste connaître un petit peu GIT.
Cette page devrait vous éclairer sur la structure des fichiers de langue.

## Où sont les fichiers de langue ?

Ces fichiers se trouvent à deux endroits. Le *CODE_LANG* correspond aux deux premières lettre 
de votre langue (ex: en, fr, de).

### Strings (textes)

`src/lang/_strings/CODE_LANG.po`

* Ce sont les textes que l'on retrouve un peu partout dans l'application. En général il suffit de mettre à jour `msgstr`.
* Si il n'y a pas de `msgstr` pour le texte donné, copiez le de en.po et mettez le à jour.

Exemple (fr.po) :
``` 
msgctxt ""
msgid "Select a filter"
msgstr "Sélectionner un filtre"
```

### Pages

`src/lang/CODE_LANG/PAGE.md`

* Ce sont des pages complètes qui peuvent être remplacées avec une langue différente.
* Ce pages sont écrites au format [markdown](https://en.wikipedia.org/wiki/Markdown).
* Si il n'y pas de *PAGE*.md pour votre langue, copiez-le du répertoire `en` et éditez-le.
* Créez uniquement un fichier *PAGE*.md pour une traduction complète

## Rajoute une nouvelle langue

**Exemple:** Si votre nouvelle langue est `French` il aura `fr` fr comme *CODE_LANG*.

### Dites-le à l'application

Vous devez aussi dire à l'application de rajouter cette langue comme option. Pour cela il faut éditer
ce fichier `/src/js/helpers/translate.js.coffee` et rajouter `fr: "French"` aux langues dans `getLanguages`.

### Dupliquez la structure de fichier et de répertoire de `en`

Copiez les fichiers que vous voulez traduire:

* **Strings:** Copiez `/src/_strings/en.po` dans `/src/_strings/fr.po`
* **Pages:** Copiez `/src/en/readme.md` dans `/src/fr/readme.md`

## Testez

Pour tester vous devez générer une nouvelle version de l'application, cependant si vous suivez une structure
 déjà existante cela n'est pas forcément nécessaire.

Si vous voulez **vraiment** tester votre langue dans l'application, il faut :

1. Vous assurer que `nodejs`, `npm` sont installés
2. `cd /chorus/folder`
3. `npm install` (seulement la première fois)
4. `grunt lang` (cela va reconstruire les dichiers de langue dans le répertoire `dist/lang`)
5. Rafraîchir Chorus
  
## Solution de repli

Les traductions doivent se rabattre sur l'anglais sauf si `msgid` est défini dans le fichier
`CODE_LANG.po` ou si une page `LANG_CODE/PAGE.md` existe.

## Proposez une mise à jour

Envoyer une *pull request* sur [GitHub](https://github.com/xbmc/chorus2) sur une nouvelle branche est
la meilleure manière. Je peux envisager des mises à jour par d'autres méthodes.
