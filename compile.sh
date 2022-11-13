#!/bin/bash

echo 'building molly-js fron-tend'

browserify -t [ babelify ] ./bundle/js/main.js > ./bundle/minify.js
minify ./bundle/minify.js > ./bundle/bundle.js
rm -R ./bundle/minify.js
