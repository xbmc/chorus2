#!/bin/bash

if [ "$1" == "" ]; then
  echo "Missing version number. I did nothing"
  exit 1
fi

echo "Update pages"
echo "=============================================="
PAGES_SRC=src/lang/en
cp readme.md $PAGES_SRC/app-readme.md
cp changelog.txt $PAGES_SRC/app-changelog.md
cp src/lang/readme.md $PAGES_SRC/lang-readme.md

echo "Update version number to $1"
echo "=============================================="
# This assumes the version number is on line 4 of dist/addon.xml
sed -i "4s/version=\"[^\"]*/version=\"$1/" dist/addon.xml

echo "Running Grunt"
echo "=============================================="
grunt build

echo "removing old zip"
echo "=============================================="
rm webinterface.kodi*.zip

echo "Building zip"
echo "=============================================="
cp -r ./dist ./webinterface.kodi
zip -r -q webinterface.kodi.$1.zip ./webinterface.kodi
rm -rf ./webinterface.kodi

echo "Build complete"
echo "=============================================="
