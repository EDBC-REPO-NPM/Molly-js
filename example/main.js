const molly = require('../main');
const path = require('path');

molly.createHTTPServer({
    controller: path.join(__dirname,'Controller'),
    viewer: path.join(__dirname,'Viewer'),
});