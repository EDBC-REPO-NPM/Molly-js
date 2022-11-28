const os = require('os');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const http2 = require('http2');
const cluster = require('cluster');

const app = require('./module/app');
const key = require('./module/ssl');

const output = new Object(); const ssl = key();
const HTTP = process.env.HTTP || process.env.PORT || 3000;
const HTTPS = process.env.HTTPS || process.env.PORT || 4000;
const HTTP2 = process.env.HTTP2 || process.env.PORT || 5000;

/*----------------------------------------------------------------------------------------*/

const globalConfig = {

  mimeType: JSON.parse( fs.readFileSync( path.join(__dirname,'json/mimetype.json') ) ),

  controller: path.join( process.cwd(), 'Controller' ),
  view: path.join( process.cwd(), 'View' ),
  threads: os.cpus().length,

  chunkSize: Math.pow( 10,6 ) * 10,
  timeout: 1000 * 60 * 2,
  root: __dirname,

}

globalConfig.keys = Object.keys(globalConfig.mimeType)

/*----------------------------------------------------------------------------------------*/

function copy( A,B ){
  const result = new Object();
  for( var i in A ) result[i] = A[i];
  for( var i in B ) result[i] = B[i];
  return result;
}

/*----------------------------------------------------------------------------------------*/

output.createHTTPServer = function( ...args ){

  const clb = typeof args[0] == 'function' ? args[0] :
              typeof args[1] == 'function' ? args[1] : null;
  
  const cfg = typeof args[0] == 'object' ? args[0] :
              typeof args[1] == 'object' ? args[1] : null;

  const config = copy( globalConfig, args[0] );
  const port = config.port || HTTP;

  if (cluster.isPrimary) {

    for( let i=config.threads; i--; ) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) => { cluster.fork();
      console.log(`worker ${worker.process.pid} died by: ${code}`);
    });
    
  } else {
    const server = http.createServer( (req,res)=>{ app(req,res,config,'HTTP') } );
          server.listen( port,'0.0.0.0',()=>{ console.log({
        protocol: 'HTTP', status: 'started',
        workerID: process.pid, port: port
      }); if(clb) clb(server);
    }).setTimeout( config.timeout );
  }

}
	
/*----------------------------------------------------------------------------------------*/
output.createHTTPSServer = function( ...args ){

  const clb = typeof args[0] == 'function' ? args[0] :
              typeof args[1] == 'function' ? args[1] : null;
  
  const cfg = typeof args[0] == 'object' ? args[0] :
              typeof args[1] == 'object' ? args[1] : null;

  const config = copy( globalConfig, args[0] );
  const port = config.port || HTTPS;
  const key = config.key || ssl;

  if (cluster.isPrimary) {

    for( let i=config.threads; i--; ) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) => { cluster.fork();
      console.log(`worker ${worker.process.pid} died by: ${code}`);
    });

  } else {
    const server = https.createServer( key,(req,res)=>{ app(req,res,config,'HTTPS') } );
          server.listen( port,'0.0.0.0',()=>{ console.log({
        protocol: 'HTTPS', status: 'started',
        workerID: process.pid, port: port
      }); if( clb ) clb(server);
    }).setTimeout( config.timeout );
  }

}
	
/*----------------------------------------------------------------------------------------*/
output.createHTTP2Server = function( ...args ){

  const clb = typeof args[0] == 'function' ? args[0] :
              typeof args[1] == 'function' ? args[1] : null;
  
  const cfg = typeof args[0] == 'object' ? args[0] :
              typeof args[1] == 'object' ? args[1] : null;

  const config = copy( globalConfig, args[0] );
  const port = config.port || HTTP2; 
  const key = config.key || ssl;

  if (cluster.isPrimary) {

    for( let i=config.threads; i--; ) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) => { cluster.fork();
      console.log(`worker ${worker.process.pid} died by: ${code}`);
    });

  } else {
    const server = http2.createSecureServer( key,(req,res)=>{ app(req,res,config,'HTTP2') } );
          server.listen( port,'0.0.0.0',()=>{ console.log({
        protocol: 'HTTP2', status: 'started',
        workerID: process.pid, port: port
      }); if( clb ) clb(server);
    }).setTimeout( config.timeout );
  }

}

module.exports = output;
