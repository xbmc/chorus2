#!/bin/bash

if [ "$1" == "" ]; then
  echo "Missing version number. I did nothing"
  exit 1
fi

echo "Running Grunt"
echo "=============================================="
grunt build

echo "Running compass"
echo "=============================================="
compass clean ./src/themes/base
compass compile ./src/theme/base -e production

echo "removing old zip"
echo "=============================================="
rm webinterface.default*.zip

echo "Building zip"
echo "=============================================="
cp -r ./dist ./webinterface.default
zip -r -q webinterface.default.$1.zip ./webinterface.default
rm -rf ./webinterface.default

echo "Build complete"
echo "=============================================="

