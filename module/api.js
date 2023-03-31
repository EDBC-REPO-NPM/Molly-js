
const fs = require('fs');
const url = require('url');
const header = require('./header');
const fetch = require('molly-fetch');
const bundler = require('./bundler');
const encoder = require('./encoder');
const { Buffer } = require('buffer');
const deviceInfo = require('./deviceInfo');

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

let globalConfig = undefined;

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

function setMimetype( _path ){
	if( !(/\.\w+$/).test(_path) ) return 'text/html';
	const keys = Object.keys(globalConfig.mimetype);
	const type = _path.match(/\.\w+$/);
	for( let key of keys ){ if( _path.endsWith(key) ) 
		return globalConfig.mimetype[key];
	}	return `application/${type}`;
}

function cookieParser( _cookie ){
	try{

		_cookie = _cookie.replace(/\s/gi,'');
		const arr = _cookie.split(';');
		const object = new Object();
		
		arr.map(x=>{
			const args = x.split('=');
			object[args[0]] = args[1];
		}); return object;

	} catch(e) { return new Object(); }
}

function parseParameters( ...args ){
	const obj = { status: 200, cache: false }; 
	for( var i in args ){
		switch( typeof args[i] ){
			case 'number': obj['status'] = args[i]; break;
			case 'boolean':obj['cache'] = args[i]; break;
			case 'string': obj['mime'] = args[i]; break;
			default: break;
		}
	}	return obj;
}

function getInterval( range,chunkSize,size ){
	const interval = range.match(/\d+/gi);
	const start = Math.floor(+interval[0]/chunkSize)*chunkSize; 
	const end = !interval[1] ? Math.min( chunkSize+start, size-1 ) :
				+interval[1];
	return { start, end };
}

function parseData( data ){
	if( typeof data === 'object' )
		 return JSON.stringify(data);
	else return data;
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

function sendStaticFile( req,res,url,status ){
	try{
 
		const chunkSize = +req.headers['chunk-size'] || 
						  Math.pow(10,6) * 10;
		const size = fs.statSync( url ).size;
        const mimetype = setMimetype( url );
		const range = req.headers.range;

		if ( (/json|text|xml/i).test(mimetype) ){			
			fs.readFile( url,async(error,data)=>{
				if( error ){ return res.send('Oops file not found',404); }
				return encoder ( 
					status, await bundler(req,res,data,mimetype,globalConfig),
					req, res, header.static(globalConfig,mimetype,true)
				); 	
			});
		} else if( range ) {
			const {start,end} = getInterval( range, chunkSize, size );
			const headers = header.stream(globalConfig,mimetype,start,end,size);
			const data = fs.createReadStream( url,{start,end} );
			encoder( 206, data, req, res, header ); return 0;
		} else { 
			res.writeHead( status, header.static(globalConfig,mimetype,true) );
			const str = fs.createReadStream(url); str.pipe(res);
		}
		
	} catch(e) { res.send(e,404); }
} 

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

function sendStreamFile( req,res,url,status ){
	try { 

		url.headers = !url.headers ? req.headers : url.headers;
		url.method = !url.method ? req.method : url.method;
		url.chunkSize = +req.headers['chunk-size'] || 
						Math.pow(10,6)*10;
		url.responseType = 'stream';
		url.decode = false;
		url.body = req;
		
		return fetch(url).then((rej)=>{
			res.writeHeader( rej.status, rej.headers );
			rej.data.pipe( res );
		}).catch((rej)=>{ 
			try {
				if( url.headers.range && !(/text/i).test(url.headers['content-type']) ) 
					rej.status = 100; res.writeHeader( rej.status, rej.headers );
					rej.data.pipe( res );
			} catch(e) {
				res.writeHeader( 404, {'content-type':'text/plain'} );
				res.end(e.message);
			}
		});

	} catch(e) { res.send(e.message,404); }
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

module.exports = function( req,res,config,protocol ){

	globalConfig = config;

    req.parse = url.parse(req.url,true); req.query = req.parse.query; 

	req.parse.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
	req.parse.host = req.headers['x-forwarded-host'] || req.headers['host'];
	req.parse.protocol = req.headers['x-forwarded-proto'] || protocol;
	req.parse.cookie = cookieParser( req.headers.cookie );
	delete req.parse.hostname; delete req.parse.slashes;
	delete req.parse.port;

	req.parse.referer = req.headers['referer'];
	req.parse.mimetype = setMimetype(req.url);
	req.parse.params = new Array();
	req.parse.method = req.method;

	req.isDesktop = deviceInfo.isDesktop(req,res);
	req.browser = deviceInfo.getBrowser(req,res);
	req.isMobile = deviceInfo.isMobile(req,res);
	req.isTV = deviceInfo.isTV(req,res);
	req.OS = deviceInfo.getOS(req,res);

	const reg = new RegExp('\/[-|_:@$]\/.+','gi');
	const api = req.parse.pathname.match(reg)?.join(''); if( api ) {
		req.parse.pathname = req.parse.pathname.replace(api,'');
		req.parse.params.push(...api.slice(3).split('/'));
	};	req.params = req.parse.params;

	res.send = async ( _data, ...args )=>{ 
		const d = parseData( _data ); const v = parseParameters( ...args );
		req.parse.mimetype = globalConfig.mimetype[v.mime]||req.parse.mimetype;
		const mimetype = typeof d === 'object' ? 'application/json' : req.parse.mimetype;
		encoder( v.status, d, req, res, header.static(globalConfig,mimetype,v.cache) );
		return true;
	}

	res.sendFile = ( _path, ...args )=>{
		const v = parseParameters( ...args ); 
		req.parse.mimetype = globalConfig.mimetype[v.mime]||req.parse.mimetype;
		if((/^http/i).test(_path)) _path = { url:_path };
		if(typeof _path === 'object') sendStreamFile( req,res,_path,v.status );
		else if(fs.existsSync(_path)) sendStaticFile( req,res,_path,v.status );
		else res.send( '0ops 404 file not found',404 ); return true;
	}

	res.sendStream = ( _data, ...args )=>{
		const v = parseParameters( ...args );
		const mimetype = globalConfig.mimetype[v.mime]||req.parse.mimetype;
		encoder( v.status, _data, req, res, header.static(globalConfig,mimetype,v.cache) );
		return true;
	}

	res.getStream = ( ...args )=>{
		const v = parseParameters( ...args );
		const mimetype = globalConfig.mimetype[v.mime]||req.parse.mimetype;
		res.writeHead( v.status, header.static(globalConfig,mimetype,v.cache) ); 
		return res; 
	}

	res.sendRaw = async ( _object )=>{ 
		encoder( _object.status, _object.data, req, res, _object.headers ); 
		return true; 
	}

	res.redirect = ( _url )=>{ 
		res.writeHead(301, {'location':_url}); 
		res.end(); return true; 
	}

	res.HTTPSredirect = ()=>{ res.redirect(`https://${req.parse.host}`); }
	res.HTTPredirect = ()=>{ res.redirect(`http://${req.parse.host}`); }
     
    return { req:req, res:res }
}
