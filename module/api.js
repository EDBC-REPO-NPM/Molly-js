
const fs = require('fs');
const url = require('url');
const https = require('https');
const fetch = require('molly-fetch');
const headers = require('./headers');
const bundler = require('./bundler');
const encoder = require('./encoder');
const { Buffer } = require('buffer');
const deviceInfo = require('./deviceInfo');

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

let globalConfig = undefined;

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

function setMimeType( _path ){
	if( !(/\.\w+$/).test(_path) ) return 'text/html';
	for(var i in globalConfig.keys){ let key = globalConfig.keys[i];
		if( _path.endsWith(key) ) return globalConfig.mimeType[key];
	}	return 'text/plain';
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
	const obj = { status: 200 }; for( var i in args ){
		switch( typeof args[i] ){
			case 'number': obj['status'] = args[i]; break;
			case 'string': obj['mime'] = args[i]; break;
			default: break;
		}
	}	return obj;
}

function parseData( data ){
	if( typeof data === 'object' )
		 return JSON.stringify(data);
	else return data;
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

function sendStaticFile( req,res,url,status ){
	try{ req.setEncoding('utf8');

		const size = fs.statSync( url ).size;
        const mimeType = setMimeType( url );
		const range = req.headers.range;

		if( range ) {
			const interval = range.match(/\d+/gi);
			const chuckSize = globalConfig.chunkSize;

			let start = +interval[0]; 
			let end = interval[1] ? +interval[1]:
				Math.min(chuckSize+start,size-1);

			const headers = headers.streamHeader(globalConfig,mimeType,start,end,size);
			const data = fs.createReadStream( url,{start,end} );
			encoder( 206, data, req, res, headers );
			return 0;
		}

		if( (/audio|video/i).test(mimeType) && !range ){
			res.writeHead( 200,{ 'Content-Type': mimeType }); 
			res.end();
		} else if ( (/text|xml/i).test(mimeType) ){			
			fs.readFile( url,async(error,data)=>{
				if( error ){ return res.send('Oops file not found',404); }
				return encoder ( 
					status, await bundler(req,res,data,mimeType,globalConfig),
					req, res, headers.staticHeader(globalConfig,mimeType,true)
				); 	
			});
		} else { 
			res.writeHead( status, headers.staticHeader(globalConfig,mimeType,true) );
			const str = fs.createReadStream(url); str.pipe(res);
		}
	} catch(e) { res.send(e,404); }
} 

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

function sendStreamFile( req,res,url,status ){
	try { 

		const range = req.headers.range;
		url.responseType = 'stream';
		
		if( range ){

			const interval = range.match(/\d+/gi);
			const size = globalConfig.chunkSize;
			const chunk = +interval[0]+size;
			const start = +interval[0];
			const end = +start+chunk;
			
			url.headers['range'] = `bytes=${start}-${end}`;

			return fetch(url).then((data)=>{
				const mimeType = data.headers['content-type'] || 'text/plain';
				const interval = data.headers['content-range'].match(/\d+/gi);
				const start = +interval[0], size = +interval[2], end = +interval[1];
				encoder( 206, data.data, req, res, headers.streamHeader(globalConfig,mimeType,start,end,size) );
			}).catch((e)=>{ res.send(e?.response?.data,100) });

		} else {
			fetch(url).then(async(data)=>{
				const mimeType = data.headers['content-type']; encoder ( 
					status, data.data, req, res, 
					headers.staticHeader(globalConfig,mimeType,true) 
				);
			}).catch((e)=>{ res.send(e?.response?.data,504); });	
		} 

	} catch(e) { res.send(e.message,404); }
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

module.exports = function( req,res,config,protocol ){

	globalConfig = config;

    req.parse = url.parse(req.url,true); req.query = req.parse.query; 
	req.parse.cookie = cookieParser( req.headers.cookie );
	req.parse.ip = req.headers['x-forwarded-for'] ||
				   req.socket.remoteAddress || null;
	
	req.parse.host = `${req.headers['host']}${req.parse.path}`;
	req.parse.referer = req.headers['Referer'];
	req.parse.mimetype = setMimeType(req.url);

	req.parse.hostname = req.headers['host'];
	req.parse.params = new Array();
	req.parse.method = req.method;
	req.parse.protocol = protocol;

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
		req.parse.mimetype = globalConfig.mimeType[v.mime]||req.parse.mimetype;
		const mimeType = typeof d === 'object' ? 'application/json' : req.parse.mimetype;
		encoder( v.status, d, req, res, headers.staticHeader(globalConfig,mimeType,false) );
		return true;
	}

	res.sendFile = ( _path, ...args )=>{
		const v = parseParameters( ...args ); 
		req.parse.mimetype = globalConfig.mimeType[v.mime]||req.parse.mimetype;
		if((/^http/i).test(_path)) _path = { url:_path };
		if(typeof _path === 'object') sendStreamFile( req,res,_path,v.status );
		else if(fs.existsSync(_path)) sendStaticFile( req,res,_path,v.status );
		else res.send( '0ops something went wrong',404 ); return true;
	}

	res.sendStream = ( _data, ...args )=>{
		const v = parseParameters( ...args );
		const mimeType = globalConfig.mimeType[v.mime]||req.parse.mimetype;
		encoder( v.status, _data, req, res, headers.staticHeader(globalConfig,mimeType,true) );
		return true;
	}

	res.getStream = ( ...args )=>{
		const v = parseParameters( ...args );
		const mimeType = globalConfig.mimeType[v.mime]||req.parse.mimetype;
		res.writeHead( v.status, headers.staticHeader(globalConfig,mimeType,true) ); 
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
