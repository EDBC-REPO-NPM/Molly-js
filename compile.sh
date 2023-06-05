#!/bin/bash

echo 'building bundle.js (molly-js frontend) -> browserify'
#browserify -t [ babelify --presets [@babel/preset-env] ] ./bundle/js/main.js > ./bundle/minify.js
browserify ./bundle/js/main.js > ./bundle/minify.js

echo 'building bundle.js (molly-js frontend) -> minify'
minify ./bundle/minify.js > ./bundle/bundle.js 

echo 'building bundle.js (molly-js frontend) -> trash'
rm -R ./bundle/minify.js