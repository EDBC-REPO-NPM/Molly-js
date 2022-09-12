
const fs = require('fs');
const url = require('url');
const fetch = require('axios');
const https = require('https');
const headers = require('./headers');
const bundler = require('./bundler');
const encoder = require('./encoder');
const { Buffer } = require('buffer');

function setMimeType( _path ){
	for( var i in process.molly.keys ){
		let key = process.molly.keys[i];
		if( _path.endsWith(key) ) 
            return process.molly.mimeType[key];
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

function sendStaticFile( req,res,url,status ){
	try{ req.setEncoding('utf8');

		const size = fs.statSync( url ).size;
        const mimeType = setMimeType( url );
		const range = req.headers.range;

		if( (/audio|video/i).test(req.query.type) && !range ){
			res.writeHead( 200,{ 'Content-Type': mimeType }); res.end();
		} else if( !range || (/htmp/i).test(mimeType) ){

			const header = { "Content-Type":mimeType };
			
			fs.readFile( url,async(error,data)=>{
				if( !error ) return encoder ( 
					status, await bundler(req,res,data,mimeType),
					req, res, headers.staticHeader(mimeType,0)
				); 	return res.send(404,'Oops file not found');
			});
            
		} else { 
			const interval = range.match(/\d+/gi);
			const chuckSize = process.molly.chunkSize;

			let start = +interval[0]; 
			let end = interval[1] ? +interval[1]:
				Math.min(chuckSize+start,size-1);

			const data = fs.createReadStream( url,{start,end} );
			encoder( 206, data, req, res, headers.streamHeader(mimeType,start,end,size) );
			
		}
	} catch(e) { res.send(404,e); }
} 

function sendStreamFile( req,res,url,status ){
	try{
		url.responseType = 'stream';
		const range = req.headers.range;
		if( !url.headers ) url.headers = new Object();
		url.httpsAgent = new https.Agent({ rejectUnauthorized: false });

		if( (/audio|video/i).test(req.query.type) && !range ){
			res.writeHead( 200,{ 'Content-Type': req.query.type }); res.end();
		} else if( !range ){
			fetch(url).then(async(data)=>{
				const mimeType = data.headers['content-type']; encoder ( 
					status, data.data, req, res, 
					headers.staticHeader(mimeType,0) );
			}).catch((e)=>{ res.send(504,e?.response?.data); });	
		} else { 

			const interval = range.match(/\d+/gi);
				
			let chunk = +interval[0] + process.molly.chunkSize;
			url.headers['range'] = interval[1] ? range : range+chunk;

			fetch(url).then((data)=>{
				const interval = data.headers['content-range'].match(/\d+/gi);
				const mimeType = data.headers['content-type'];
				const start = +interval[0]; 
				const size = +interval[2];	
				const end = +interval[1];

				encoder( 206, data.data, req, res, headers.streamHeader(mimeType,start,end,size) );
			}).catch((e)=>{ res.send(504,e?.response?.data); console.log(e) });

		}
	} catch(e) { res.send(404,e.message); }
}

module.exports = function( req,res,protocol ){

    req.parse = url.parse(req.url,true); req.query = req.parse.query; 
	req.parse.cookie = cookieParser( req.headers.cookie );
	req.parse.ip = req.headers['x-forwarded-for'] ||
				   req.socket.remoteAddress || null;
	req.parse.origin = req.headers['Referer'];
	req.parse.hostname = req.headers['host'];
	req.parse.method = req.method;
	req.parse.protocol = protocol;
	req.parse.host = req.url;

	req.downloadFile = ( _url,_path )=>{ 
		return new Promise( (res,rej)=>{ try{
			
			if( (/$http/gi).test(_url) ){
				fetch.get(_url,{responseType:'stream'})
				.then((response)=>{
					let _newPath = fs.createWriteStream(_path)
					response.data.pipe( _newPath ); res();
				}).catch((e)=>{ rej(e) });
			
			} else if( (/$data/gi).test(_url) ) {
				const data = _url.split('base64,').pop();
				fs.writeFile( _path, data, {encoding: 'base64'}, (err)=>{
					if(err) return rej(err);
					return res('done');
				});
			
			} else { rej('url not supported') }
		
		} catch(e) { rej(e) }});			
	}

	res.send = async ( _status, _data, _type='html' )=>{
		const mimeType = process.molly.mimeType[_type] || 'text/plain';
		encoder( _status, _data, req, res, headers.staticHeader(mimeType) );
		return true;
	}
		
	res.sendFile = ( _path,status=200 )=>{
		if(typeof _path === 'object') sendStreamFile( req,res,_path,status );
		else if(fs.existsSync(_path)) sendStaticFile( req,res,_path,status );
		else res.send( 404,'0ops something went wrong' ); return true;
	}
    
	res.json = ( _status,_obj ) =>{ res.send( _status, JSON.stringify(_obj) ); return true; }
	res.redirect = ( _url )=>{ res.writeHead(302, {'location':_url}); res.end(); return true; }
	res.raw = async ( _object )=>{ encoder( _object.status, _object.data, req, res, _object.headers ); return true; }
     
    return { req:req, res:res }
}
