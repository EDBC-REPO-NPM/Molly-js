#!/bin/bash

echo 'building molly-js front-end'

browserify -t [ babelify --presets [@babel/preset-env] ] ./bundle/js/main.js > ./bundle/minify.js
minify ./bundle/minify.js > ./bundle/bundle.js
rm -R ./bundle/minify.js
