const {Buffer} = require('buffer');
const stream = require('stream');
const zlib = require('zlib');
const fs = require('fs');

function error(err){}

module.exports = (status,raw,req,res,headers)=>{
    try{

        const encoder = req.headers['accept-encoding'];
        const data = stream.Readable.from(raw);
        let lib;

        /*
        try {
            const size = Buffer.byteLength( Buffer.from(raw) );
            headers["Content-Length"] = size;
        } catch(e) {  }
        */
    
        if (/\bbr\b/.test(encoder)) {
            lib = 'createBrotliCompress';
            headers["Content-Encoding"] = 'br'; 
            headers["Vary"] = "Accept-Encoding";
        } else if (/\bgzip\b/.test(encoder)) {
            lib = 'createGzip';
            headers["Vary"] = "Accept-Encoding";
            headers["Content-Encoding"] = 'gzip'; 
        } else if ((/\bdeflate\b/).test(encoder)) {
            lib = 'createDeflate';
            headers["Vary"] = "Accept-Encoding";
            headers["Content-Encoding"] = 'deflate';
        }
        
        res.writeHead( status, headers );
        if(!lib) return stream.pipeline(data, res, error);
        else return stream.pipeline(data, zlib[lib](), res, error);  

    } catch(e) { res.writeHead( status, headers ); res.end( raw ) }
}
