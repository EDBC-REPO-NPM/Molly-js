const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const http2 = require('http2');
const cluster = require('cluster');

const app = require('./module/app');
const ssl = require('./module/ssl');

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

const output = new Object(); const ssl = key();
const HTTP = process.env.HTTP || process.env.PORT || 3000;
const HTTPS = process.env.HTTPS || process.env.PORT || 4000;
const HTTP2 = process.env.HTTP2 || process.env.PORT || 5000;

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

const globalConfig = {
  mimetype: JSON.parse( fs.readFileSync( path.join(__dirname,'json/mimetype.json') ) ),
  controller: path.join( process.cwd(), 'Controller' ),
  viewer: path.join( process.cwd(), 'Viewer' ),
  root: __dirname, security: false,
  bundler: true, thread: 1,
  timeout: 1000 * 60 * 2,
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

function copy( A,B ){
  const result = new Object();
  for( var i in A ) result[i] = A[i];
  for( var i in B ) result[i] = B[i];
  return result;
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

output.createHTTPServer = function( ...args ){

  const clb = typeof args[0] == 'function' ? args[0] :
              typeof args[1] == 'function' ? args[1] : null;
  
  const cfg = typeof args[0] == 'object' ? args[0] :
              typeof args[1] == 'object' ? args[1] : null;

  const config = copy( globalConfig, args[0] );
  const host = config.host || '0.0.0.0';
  const port = config.port || HTTP;

  if (cluster.isPrimary) {

    for( let i=config.thread; i--; ) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) => { cluster.fork();
      console.log(`worker ${worker.process.pid} died by: ${code}`);
    });
    
  } else {
    const server = http.createServer( (req,res)=>{ app(req,res,config,'HTTP') } );
      server.listen( port,host,()=>{ console.log(JSON.stringify({
        name: 'molly-js', protocol: 'HTTP', port: port, host: host
      })); if(clb) clb(server);
    }).setTimeout( config.timeout );
  }

}
	
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

output.createHTTPSServer = function( ...args ){

  const clb = typeof args[0] == 'function' ? args[0] :
              typeof args[1] == 'function' ? args[1] : null;
  
  const cfg = typeof args[0] == 'object' ? args[0] :
              typeof args[1] == 'object' ? args[1] : null;

  const key = ssl.parse(cfg.key) || ssl.default();
  const host = cfg.host || '0.0.0.0';
  const port = cfg.port || HTTP2; 
  const th = cfg.thread || 1;

  if (cluster.isPrimary) {

    for( let i=config.thread; i--; ) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) => { cluster.fork();
      console.log(`worker ${worker.process.pid} died by: ${code}`);
    });

  } else {
    const server = https.createServer( key,(req,res)=>{ app(req,res,config,'HTTPS') } );
      server.listen( port,host,()=>{ console.log(JSON.stringify({
        name: 'molly-js', protocol: 'HTTPS', port: port, host: host
      })); if( clb ) clb(server);
    }).setTimeout( config.timeout );
  }

}
	
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

output.createHTTP2Server = function( ...args ){

  const clb = typeof args[0] == 'function' ? args[0] :
              typeof args[1] == 'function' ? args[1] : null;
  
  const cfg = typeof args[0] == 'object' ? args[0] :
              typeof args[1] == 'object' ? args[1] : null;

  const key = ssl.parse(cfg.key) || ssl.default();
  const host = cfg.host || '0.0.0.0';
  const port = cfg.port || HTTP2; 
  const th = cfg.thread || 1;
  
  key.allowHTTP1 = cfg.allowHTTP1 || false;

  if (cluster.isPrimary) {

    for( let i=config.thread; i--; ) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) => { cluster.fork();
      console.log(`worker ${worker.process.pid} died by: ${code}`);
    });

  } else {
    const server = http2.createSecureServer( key,(req,res)=>{ app(req,res,config,'HTTP2') } );
      server.listen( port,host,()=>{ console.log(JSON.stringify({
        name: 'molly-js', protocol: 'HTTP2', port: port, host: host
      })); if( clb ) clb(server);
    }).setTimeout( config.timeout );
  }

}

module.exports = output;
