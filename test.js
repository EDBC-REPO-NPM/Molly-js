const molly = require('./main');
const path = require('path');

function main(){
    molly.createHTTP2Server({ 
        controller: path.join(__dirname,'testServer','Controller'),
        viewer: path.join(__dirname,'testServer','Viewer'),
        host: 'localhost', thread: 1, allowHTTP1: true,
    });
} main();