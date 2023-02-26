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

output.headerExtention = ( headers,cache,size )=>{

	if( globalConfig.strict ){
		headers["Content-Security-Policy-Reporn-Only"] = "default-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self';";
		headers["referrer-policy"] = "origin-when-cross-origin, strict-origin-when-cross-origin";
		headers["Strict-Transport-Security"] = `max-age=${ expirationAge() }; preload`;
	};	
	
	if( cache ) 
		headers["Cache-Control"] = `public, max-age=${ expirationAge() }`;
		headers["Set-Cookie"] = 'cross-site-cookie=whatever; SameSite=None; Secure';

	if( globalConfig.cors ){ 
		headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";
		headers["Access-Control-Allow-Methods"] = "OPTIONS, POST, GET";
		headers["cross-origin-resource-policy"] = "cross-origin";
		headers["Access-Control-Max-Age"] = expirationAge();
		headers["Access-Control-Allow-Origin"] = "*"; 
	}	

	if( globalConfig.iframe ) 
		headers["x-frame-options"] = globalConfig.iframe;
	if( size!=0 ) headers["Content-Length"] = size;
		headers["powered-by"] = "molly-js";
		headers["x-xss-protection"] = 0;
		
	if( globalConfig.headers )
		Object.keys( process.headers ).forEach( (key)=>{
			headers[key] = process.headers[key];
		});
	
	return headers;			
}
	
output.staticHeader = function( config,mimeType,cache ){
	globalConfig = config;
	const headers = { "Content-Type":mimeType }; 
	return output.headerExtention( headers,cache,0 );
}

output.streamHeader = function( config,mimeType,start,end,size ){
	globalConfig = config;
	const length = end-start+1; const headers = {
		"Content-Range":`bytes ${start}-${end}/${size}`,
		"Accept-Ranges":"bytes", "Content-Type": mimeType,
	};	return output.headerExtention( headers,true,length );
}

module.exports = output;