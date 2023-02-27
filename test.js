const molly = require('./main');
const path = require('path');

function main(){
    molly.createHTTPServer({
        controller: path.join(__dirname,'testServer','Controller'),
        viewer: path.join(__dirname,'testServer','Viewer'),
    });
} main();