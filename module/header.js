const output = new Object();
let globalConfig = undefined;

function expirationAge(){
    const today = new Date();
    const tomrw = new Date();
    tomrw.setDate( tomrw.getDate() + 1 );
    tomrw.setHours(0); tomrw.setSeconds(0);
    tomrw.setMinutes(0); tomrw.setMilliseconds(0);
    timeout = (tomrw.getTime()-today.getTime())/Math.pow(10,3);
	return globalConfig.maxAge || parseInt( timeout );
}

output.header = ( headers,cache,size )=>{ const age = expirationAge();

	if( globalConfig.strict ){
		headers["content-security-policy-reporn-only"] = "default-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self';";
		headers["referrer-policy"] = "origin-when-cross-origin, strict-origin-when-cross-origin";
		headers["strict-transport-security"] = `max-age=${ age }; preload`;
	};	
	
	if( cache ) 
		headers["cache-control"] = `public, max-age=${ age }`;

	if( globalConfig.cors ){ 
		headers["access-control-allow-headers"] = "Origin, X-Requested-With, content-type, Accept";
		headers["access-control-allow-methods"] = "OPTIONS, POST, GET";
		headers["cross-origin-resource-policy"] = "cross-origin";
		headers["access-control-allow-origin"] = "*"; 
		headers["access-control-max-age"] = age;
	}	

	if( globalConfig.iframe ) 
		headers["x-frame-options"] = globalConfig.iframe;

	if( size!=0 ) headers["content-length"] = size;
		headers["powered-by"] = "molly-js";
		headers["x-xss-protection"] = 0;
		
	return headers;			
}
	
output.static = function( config,mimeType,cache ){
	globalConfig = config;
	const headers = { "content-type":mimeType }; 
	return output.header( headers,cache,0 );
}

output.stream = function( config,mimeType,start,end,size ){
	globalConfig = config;
	const length = end-start+1; const headers = {
		"content-range":`bytes ${start}-${end}/${size}`,
		"accept-ranges":"bytes", "content-type": mimeType,
	};	return output.header( headers,true,length );
}

module.exports = output;