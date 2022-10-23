echo 'building molly-js'

browserify -t [ babelify ] ./bundle/js/main.js | uglifyjs -o ./bundle/uikit/1-molly.js
node ./compiler/jsBundle.js > ./bundle/minify.js
minify ./bundle/minify.js > ./bundle/bundle.js
rm -R ./bundle/minify.js

echo 'building molly-css'

node ./compiler/cssBundle.js > ./bundle/minify.css
minify ./bundle/minify.css > ./bundle/bundle.css
rm -R ./bundle/minify.css
