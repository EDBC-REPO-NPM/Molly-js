'use strict';

//TODO: Libreries   ------------------------------------------------------------------------------//

const formidable = require('formidable');
const axios = require('axios');
const https = require('http2');
const http = require('http');
const url = require('url');
const fs = require('fs');

//TODO: String Normalization ---------------------------------------------------------------------//
const mimeType = {	
	
	//TODO: Text Plain Mimetype //
	"txt" : "text/plain",
	"text": "text/plain",
	
	//TODO: Font Mimetype //
	"otf" : "font/otf",
	"ttf" : "font/ttf",
	"woff": "font/woff",
	"woff2":"font/woff2",
	
	//TODO: Audio Mimetype //
	"oga" : "audio/ogg",
	"aac" : "audio/aac",
	"wav" : "audio/wav",
	"mp3" : "audio/mpeg",
	"opus": "audio/opus",
	"weba": "audio/webm",
	
	//TODO: Video Mimetype //
	"ogv" : "video/ogg",
	"mp4" : "video/mp4",
	"ts"  : "video/mp2t",
	"webm": "video/webm",
	"mpeg": "video/mpeg",
	"avi" : "video/x-msvideo",
	
	//TODO: Web Text Mimetype //
	"css" : "text/css",
	"csv" : "text/csv",
	"html": "text/html",
	"scss" : "text/scss",
	"ics" : "text/calendar",
	"js"  : "text/javascript",
	"xml" : "application/xhtml+xml",

	//TODO: Images Mimetype //
	"bmp" : "image/bmp",
	"gif" : "image/gif",
	"png" : "image/png",
	"jpg" : "image/jpeg",
	"jpeg": "image/jpeg",
	"webp": "image/webp",
	"svg" : "image/svg+xml",
	"ico" : "image/vnd.microsoft.icon",
	
	//TODO: Especial Mimetype //
	"zip" : "application/zip",
	"gz"  : "application/gzip",
	"sh"  : "application/x-sh",
	"json": "application/json",
	"tar" : "application/x-tar",
	"rar" : "application/vnd.rar",
	"7z"  : "application/x-7z-compressed",
	"m3u8": "application/vnd.apple.mpegurl",
	
	//TODO: Document Mimetype //
	"pdf" : "application/pdf",	
	"doc" : "application/msword",
	"vsd" : "application/vnd.visio",
	"xls" : "application/vnd.ms-excel",
	"ppt" : "application/vnd.ms-powerpoint",
	"swf" : "application/x-shockwave-flash",
	"ods" : "application/vnd.oasis.opendocument.spreadsheet",	
	"odp" : "application/vnd.oasis.opendocument.presentation",	
	"odt" : "application/vnd.oasis.opendocument.presentation",	
	"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",	
	"pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

//TODO: Main Class  ------------------------------------------------------------------------------//

const createBackend = function( front_path, back_path ){

	const mollyJS = {
		chunkSize: Math.pow( 10,6 )*10,
		keys: Object.keys( mimeType ),
		max_age: 1000 * 60 * 60 * 24,
		timeout: 1000 * 60 * 10,
		mimetype: mimeType,
		front: front_path,
		back: back_path
	};

	mollyJS.slugify = function(str){ const map = {
		'o' : 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
		'a' : 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
		'e' : 'é|è|ê|ë|É|È|Ê|Ë',
		'i' : 'í|ì|î|ï|Í|Ì|Î|Ï',
		'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
		'c' : 'ç|Ç','n':'ñ|Ñ',
		''  : /\s|\W/
	};	for (var pattern in map) { 
			str=str.replace( new RegExp(map[pattern],'g' ), pattern); 
		}	return str.toLowerCase();
	}
	
	mollyJS.headerExtention = function( headers,size=0 ){

		if( process.strict ){
			headers["Content-Security-Policy-Reporn-Only"] = "default-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self';";
			headers["referrer-policy"] = "origin-when-cross-origin, strict-origin-when-cross-origin";
			headers["Strict-Transport-Security"] = `max-age=${mollyJS.max_age}; preload`;
		}

		if( process.cors ){ 
			headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";
			headers["Access-Control-Allow-Methods"] = "OPTIONS, POST, GET";
			headers["Access-Control-Max-Age"] = mollyJS.max_age;
			headers["Access-Control-Allow-Origin"] = "*"; 
		} 

		if( process.cache ) headers["Cache-Control"] = `public, max-age=${mollyJS.max_age}`;
		if( process.iframe ) headers["x-frame-options"] = "DENY";
		if( size!=0 ) headers["Content-Length"] = size;
		
		if( process.headers )
			Object.keys( process.headers ).forEach( (key)=>{
				headers[key] = process.headers[key];
			});

		return headers;			
	}
	
	mollyJS.staticHeader = function( mimeType,size=0 ){
		const headers = {
			"Content-Type":mimeType,
		};	return mollyJS.headerExtention( headers,size );
	}

	mollyJS.chunkHeader = function( mimeType,start,end,size ){
		const length = end-start+1;
		const headers = {
			"Accept-Ranges":"bytes",
			"Content-Type": mimeType,
			"Content-Range":`bytes ${start}-${end}/${size}`,
		};	return mollyJS.headerExtention( headers,length );
	}
	
	mollyJS.router = function( req,res ){
		
		//TODO: MollyJS Req DOC ------------------------------------------------------------------//
		
		req.parse = url.parse(req.url, true);
		req.query = req.parse.query; 
		
		req.parse.method = req.method;
		req.parse.host = req.headers['host'];
		req.parse.hostname = req.headers['host'];
		req.parse.origin = req.headers['origin'];
		req.parse.ip = req.headers['x-forwarded-for'];
		req.parse.protocol = req.headers['x-forwarded-proto'];
		
		//TODO: MollyJS API DOC ------------------------------------------------------------------//
		req.parse.params = {
			url: req.parse.pathname.replace(/.api\S+/i,''),
			query: req.parse.pathname.replace(/^.+api\S/i,'').split('/'),
		};
		
		req.api = ( _params )=>{
			try{const obj = new Object();
				const keys = _params.replace(/^\W/,'').split('/');
				const prms = req.parse.params.query.replace(/^\W/,'').split('/');
				for( var i in keys ){ obj[keys[i]] = prms[i]; } return obj;
			} catch(e) { return undefined; }
		}
		
		//TODO: MollyJS METHOD DOC  --------------------------------------------------------------//

		req.get = ( callback )=>{ if( req.method === 'GET' ) callback( req,res ); }
		req.put = ( callback )=>{ if( req.method === 'PUT' ) callback( req,res ); }
		req.post = ( callback )=>{ if( req.method === 'POST' ) callback( req,res ); }	
		req.patch = ( callback )=>{ if( req.method === 'PATCH' ) callback( req,res ); }
		req.delete = ( callback )=>{ if( req.method === 'DELETE' ) callback( req,res ); }
		
		//TODO: MollyJS FILES DOC   --------------------------------------------------------------//
		
		req.saveFile = (_file,_path)=>{ fs.renameSync( _file.filepath,_path ); }
		
		req.form = ()=>{
			return new Promise( (res,rej)=>{
				const form = new formidable.IncomingForm();
				form.parse(req, (err,fields,files)=>{
					if( !err ) res( { fields:fields, files:files } );
					else rej( err );
				});
			});
		}
		
		req.downloadFile = (_url,_path)=>{ 
			return new Promise( (res,rej)=>{ try{
				if( _url.startsWith('http') ){
					axios.get(_url,{responseType:'stream'}).then( (response)=>{
						let _newPath = fs.createWriteStream(_path);
						response.data.pipe( _newPath ); 
						res();
					}).catch( err=>{} );
				} else if( _url.startsWith('data:') ) {
					const data = _url.split('base64,').pop();
					fs.writeFileSync(_path, data, {encoding: 'base64'});
					res();
				} else { rej('url not supported') }
			} catch(e) { rej(e); }});			
		}
		
		//TODO: MollyJS SEND DOC -----------------------------------------------------------------//
		res.sendFile = ( _path )=>{
			if( typeof _path === 'object' ){
				mollyJS.sendStreamFile( req,res,_path );

			} else if( fs.existsSync( _path ) ){
				for( var i in mollyJS.keys ){
					let key = mollyJS.keys[i];
					if( _path.endsWith( key ) )
						return mollyJS.sendStaticFile( req,res,_path,mimeType[key] );
				}	return mollyJS.sendStaticFile( req,res,_path,'text/plain' );

			}  else { return res._404(); }
		}
		
		res.send = ( _status, _data, _mimetype='html' )=>{
			const mimeType = mollyJS.mimetype[ _mimetype ] || 'text/plain';
			res.writeHead(_status, mollyJS.staticHeader( mimeType ));
			res.end( _data ); return 0;
		}
		
		res._404 = ()=>{ res.send( 404, mollyJS._404_() ); return 0; }
		res.json = ( _status,_obj ) =>{ res.send( _status, JSON.stringify(_obj) ); }
		res.redirect = ( _url )=>{ res.writeHead(301, {'location':_url}); res.end(); }
		
		//TODO: _main_ Function  -----------------------------------------------------------------//

		try{ mollyJS.loadController( `${mollyJS.back}/_main_.js`,req,res ); } catch(e) { }
				
		//TODO: Server Pages ---------------------------------------------------------------------//
		try{

			if( fs.existsSync(`${mollyJS.front}${req.parse.pathname}/index.html`) )
				return res.sendFile( `${mollyJS.front}${req.parse.pathname}/index.html` );

			else if( fs.existsSync(`${mollyJS.front}${req.parse.pathname}.html`) )
				return res.sendFile( `${mollyJS.front}${req.parse.pathname}.html` ); 
	
			else if( fs.existsSync(`${mollyJS.front}/${req.parse.params.url}`) ) 
				return res.sendFile( `${mollyJS.front}/${req.parse.params.url}` );

			else if( fs.existsSync(`${mollyJS.back}/${req.parse.params.url}.js`) ) 
				return mollyJS.loadController( `${mollyJS.back}/${req.parse.params.url}.js`,req,res );

			else if( req.parse.pathname == '/_mollyjs_' ) return res.sendFile( `${__dirname}/bundle.js` );

			else return res._404();
		
		} catch(err) {
			console.error(err, req.parse.path);
			res.send(404,err.message);
		}
			
	}
		
	mollyJS.sendStaticFile = function( req,res,url,mimeType ){
		try{
			const range = req.headers.range;	
			const size = fs.statSync( url ).size;

			if( !range ) {
				res.writeHead( 200,mollyJS.staticHeader( mimeType,size ) );
				res.end( fs.readFileSync( url ) );
			} else { 
				let start,end;
				const chuck_size = mollyJS.chunkSize;
				const interval = range.match(/\d+/gi);
				const data = fs.createReadStream( url,{start,end} );

				start = Number(interval[0]);
				if( interval[1] ) end = Number(interval[1]);
				else end = Math.min(chuck_size+start,size-1);
 
				res.writeHead(206, mollyJS.chunkHeader( mimeType,start,end,size ));
				data.pipe( res );
			}
		} catch(e) {
			console.log(e);
			res.send(404,'something went wrong');
		}
	}

	mollyJS.sendStreamFile = async function( req,res,url ){
		try{
			const range = req.headers.range;
			if( !url.headers ) url.headers = new Object();

			if( !range ) { 
				url.responseType = 'buffer';
				const data = await axios(url);
				const mimeType = data.headers['content-type'];
				res.writeHead( 200,mollyJS.staticHeader( mimeType,0 ) );
				res.end( data.data );
	
			} else { 
				let start,chunk,end,size;
				url.responseType = 'stream';
				
				chunk = Number(range.match(/\d+/gi)[0]) + mollyJS.chunkSize;
				url.headers['range'] = range+chunk;

				const data = await axios(url);
				const mimeType = data.headers['content-type'];
				const interval = data.headers['content-range'].match(/\d+/gi);

				start=interval[0]; size=interval[2]; end=interval[1];

				res.writeHead(206, mollyJS.chunkHeader( mimeType,start,end,size ));
				data.data.pipe( res );
			}
		} catch(e) {
			console.log(e);
			res.send(404,'something went wrong');
		}
	}
	
	mollyJS.createServer = function( PORT ){
		const server = http.createServer( mollyJS.router ).listen( PORT,'0.0.0.0',()=>{
			console.log(`server started at http://localhost:${PORT}`);
		}); server.setTimeout( mollyJS.timeout ); 
		mollyJS.httpServer = server;
		return server;
	}
	
	mollyJS.createSecureServer = function( KEY,CERT,PORT ){
		const ssl_key = { key: KEY, cert: CERT };	
		const server = https.createSecureServer( ssl_key, mollyJS.router ).listen( PORT,'0.0.0.0',()=>{
			console.log(`server started at https://localhost:${PORT}`);
		}); server.setTimeout( mollyJS.timeout ); 
		mollyJS.httpsServer = server;
		return server;
	}
	
	mollyJS._404_ = function(){ 
		let url = `${mollyJS.front}/404.html`
		if( fs.existsSync(url) )
			return fs.readFileSync(`${mollyJS.front}/404.html`); 
		return 'Oops 404 not found';
	}

	/*// TODO: V0.2 Module Loader 
	mollyJS.loadController = function( _path,req,res ){
		const  __module__ = require( _path );
		return __module__( req,res );
	}*/

	// TODO: V0.1 Module Loader 
	mollyJS.loadController = function( _path,req,res ){
		const __module__ = fs.readFileSync( _path );
		return eval(`
			try{ 
				${__module__} 
			} catch(err) { 
				console.log(err.message, _path);
				res.send(404,err.message);
			}
		`);
	}
	
	return mollyJS;
};

module.exports.createBackend = createBackend;
