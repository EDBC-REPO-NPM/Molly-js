const molly = require('./main');
const path = require('path');

function main(){
    molly.createHTTPServer({ 
        viewer: path.join(__dirname,'testServer','Viewer'), thread: 1,
        controller: path.join(__dirname,'testServer','Controller'),
    });
} main();