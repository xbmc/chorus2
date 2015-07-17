#!/bin/bash

if [ "$1" == "" ]; then
  echo "Missing version number. I did nothing"
  exit 1
fi

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
