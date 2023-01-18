const path = require('path');
const fs = require('fs');

module.exports = function( req,res,db ){ const {ip} = req.parse;
    if( !(/video|audio|image|javascript|application/).test(req.parse.mimetype) ){
        if( typeof db[ip] != 'number' ) db[ip]=0; else db[ip]++;
        if( db[ip] >= 60 ) return res.send('Max_reached',429);
    }
}