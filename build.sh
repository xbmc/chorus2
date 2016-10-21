#!/bin/bash

if [ "$1" == "" ]; then
  echo "Missing version number. I did nothing"
  exit 1
fi

echo "Update version number to $1"
echo "=============================================="
# This assumes the version number is on line 4 of dist/addon.xml
sed -i "4s/version=\"[^\"]*/version=\"$1/" dist/addon.xml
# And the first version match is for the package in package.json
sed -i "s/version\": \"[^\"]*/version\": \"$1/" package.json

echo "Running Grunt"
echo "=============================================="
grunt build

echo "removing old zip and build files"
echo "=============================================="
rm webinterface.default*.zip
rm dist/js/build/*.js

echo "Building zip"
echo "=============================================="
cp -r ./dist ./webinterface.default
zip -r -q webinterface.default.$1.zip ./webinterface.default
rm -rf ./webinterface.default

echo "Build complete"
echo "=============================================="
