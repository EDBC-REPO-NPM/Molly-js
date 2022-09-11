const os = require('os');
const fs = require('fs');
const http = require('http');
const https = require('https');
const http2 = require('http2');
const cluster = require('cluster');

const app = require(`./module/app`);
const ssl = require(`./module/ssl`);

const output = new Object();
const HTTP = process.env.HTTP || process.env.PORT || 3000;
const HTTPS = process.env.HTTPS || process.env.PORT || 4000;
const HTTP2 = process.env.HTTP2 || process.env.PORT || 5000;

/*----------------------------------------------------------------------------------------*/

(()=>{
    
  process.molly = new Object();
    
  process.molly.mimeType = JSON.parse( fs.readFileSync(`${__dirname}/json/mimetype.json`) );
  process.molly.keys = Object.keys( process.molly.mimeType );
    
  process.molly.backend = `${process.cwd()}/Controller`;
  process.molly.frontend = `${process.cwd()}/View`;
  process.molly.threads = os.cpus().length;
  process.molly.root = __dirname;
    
  process.molly.chunkSize = Math.pow( 10,6 )*10;
  //process.molly.maxAge = 60 *60 * 24 * 7;
  process.molly.timeout = 1000 * 60 * 2;
    
})();

/*----------------------------------------------------------------------------------------*/

output.controller = function( clb ){

  const worker = require('worker_threads');
  const req = worker.workerData;
  const res = new Object();

  req.drain = ()=>{ worker.parentPort.postMessage('drain'); }
  res.next = ()=>{ worker.parentPort.postMessage('next'); }
  req.body = process.stdin;
  
  res.send = ( _status,_data,_type='html' )=>{
    worker.parentPort.postMessage({
      api: 'send', atr: [ _status, _data, _type ]
    }); return true;
  }

  res.downloadFile = ( _url,_path )=>{
    worker.parentPort.postMessage({
      atr: [ _url,_path ], api: 'send',
    }); return true;
  }

  res.sendFile = ( _path,status=200 )=>{
    worker.parentPort.postMessage({
      atr: [ _path,status ], api: 'sendFile',
    }); return true;
  }

  res.json = ( _status,_obj )=>{
    worker.parentPort.postMessage({
      atr: [ _status,_obj ], api: 'json',
    }); return true;
  }

  res.redirect = ( _path )=>{
    worker.parentPort.postMessage({
      atr: [ _path ], api: 'redirect',
    }); return true;
  }

  res.raw = ( _object )=>{
    worker.parentPort.postMessage({
      atr: [ _object ], api: 'raw',
    }); return true;
  }

  clb( req,res );

}

/*----------------------------------------------------------------------------------------*/

output.createHTTPServer = function( ...args ){

  const numCPUs = os.cpus().length;
  const port= args[1] || HTTP; 
  const clb = args[0];

  if (cluster.isPrimary) {

    for( let i=process.molly.threads; i--; ) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) => { cluster.fork();
      console.log(`worker ${worker.process.pid} died by: ${code}`);
    });
    
  } else {
    const server = http.createServer( (req,res)=>{ app(req,res,'HTTP') } )
    .listen( port,'0.0.0.0',()=>{ console.log({
        protocol: 'HTTP', status: 'started',
        workerID: process.pid, port: port
      }); if(clb) clb(server);
    }).setTimeout( process.molly.timeout );
  }

}
	
/*----------------------------------------------------------------------------------------*/
output.createHTTPSServer = function( ...args ){

  const numCPUs = os.cpus().length;
  let key,clb,port;

  if( args.length > 1 ){
    key = args[0]; clb = args[1];
    port= args[2] || HTTPS; 
  } else {
    clb = args[0]; key = ssl();
    port= args[1] || HTTPS; 
  }

  if (cluster.isPrimary) {

    for( let i=process.molly.threads; i--; ) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) => { cluster.fork();
      console.log(`worker ${worker.process.pid} died by: ${code}`);
    });

  } else {
    const server = https.createServer( key,(req,res)=>{ app(req,res,'HTTPS') } )
    .listen( port,'0.0.0.0',()=>{ console.log({
        protocol: 'HTTPS', status: 'started',
        workerID: process.pid, port: port
      }); if( clb ) clb(server);
    }).setTimeout( process.molly.timeout );
  }

}
	
/*----------------------------------------------------------------------------------------*/
output.createHTTP2Server = function( ...args ){

  const numCPUs = os.cpus().length;
  let key,clb,port;

  if( args.length > 1 ){
    key = args[0]; clb = args[1];   
    port= args[2] || HTTP2; 
  } else {
    clb = args[0]; key = ssl();
    port= args[1] || HTTP2; 
  }

  if (cluster.isPrimary) {

    for( let i=process.molly.threads; i--; ) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) => { cluster.fork();
      console.log(`worker ${worker.process.pid} died by: ${code}`);
    });

  } else {
    const server = http2.createSecureServer( key,(req,res)=>{ app(req,res,'HTTP2') } )
    .listen( port,'0.0.0.0',()=>{
      console.log({
        protocol: 'HTTP2', status: 'started',
        workerID: process.pid, port: port
      }); if( clb ) clb(server);
    }).setTimeout( process.molly.timeout );
  }

}

module.exports = output;
